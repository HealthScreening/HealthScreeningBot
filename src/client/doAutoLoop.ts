import HealthScreeningBotClient from "./extraClient";
import { Config, sequelize } from "../orm";
import { TextChannel } from "discord.js";

export default async function doAutoLoop(
    client: HealthScreeningBotClient,
    logChannel: TextChannel
) {
    const validUserIDs = new Set();
    for (const [, guild] of client.guilds.cache) {
        for (const [userId] of await guild.members.fetch()) {
            validUserIDs.add(userId);
        }
    }
    const batchTimes: Map<[number, number], number> = new Map();
    for (const config of await sequelize.query(
        `SELECT * 
        FROM Configs 
        WHERE 
            (strftime('%s', date('now')) + "timeHours" * 3600 + "timeMinutes" * 60) - strftime('%s', date('now')) <= 300 
            AND (strftime('%s', date('now')) + "timeHours" * 3600 + "timeMinutes" * 60) - strftime('%s', date('now')) >=0;`,
        {
            mapToModel: true,
            model: Config,
        }
    )) {
        if (!validUserIDs.has(config.userId)) {
            continue;
        }
        batchTimes.set(
            [config.timeHours, config.timeMinutes],
            batchTimes.get([config.timeHours, config.timeMinutes])
                ? batchTimes.get([config.timeHours, config.timeMinutes]) + 1
                : 1
        );
        await client.screeningClient.queueDailyAuto(
            await client.users.fetch(config.userId),
            {
                batchTime: [config.timeHours, config.timeMinutes],
                itemNumber: batchTimes.get([
                    config.timeHours,
                    config.timeMinutes,
                ]),
                logChannel,
            }
        );
    }
    setTimeout(() => doAutoLoop(client, logChannel), 5 * 60 * 1000);
}
