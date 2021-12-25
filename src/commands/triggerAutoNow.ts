/**
 * Copyright (C) 2021 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { SlashCommandBuilder } from "@discordjs/builders";
import { TextChannel } from "discord.js";
import getValidUserIDs from "../utils/getValidUserIDs";
import getUsersForDayOfWeek from "../utils/getUsersForDayOfWeek";
import { AutoUser } from "../orm/autoUser";
import logError from "../utils/logError";
import { DateTime } from "luxon";
import ArrayStringMap from "array-string-map";
import { Op } from "sequelize";
import { HSBCommandInteraction } from "../discordjs-overrides";
import { Command } from "../client/command";

export default class TriggerAutoNow extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("trigger_auto")
    .setDescription("Run the auto screenings now.");
  async execute(interaction: HSBCommandInteraction) {
    if (interaction.user.id != "199605025914224641") {
      await interaction.reply({
        content: "You are not the bot owner!",
        ephemeral: true,
      });
    } else {
      await interaction.reply("Starting auto session...");
    }
    const logChannel: TextChannel = (await (
      await interaction.client.guilds.fetch("889983763994521610")
    ).channels.fetch("902375187150934037")) as TextChannel;
    const currentTime = DateTime.now().setZone("America/New_York");
    try {
      const validUserIDs: Set<string> = getValidUserIDs(interaction.client);
      const batchTimes: ArrayStringMap<[number, number], number> =
        new ArrayStringMap();
      const validDayOfWeekUsers = new Set(
        await getUsersForDayOfWeek(currentTime.weekday)
      );
      for (const autoItem of await AutoUser.findAll({
        where: {
          userId: {
            [Op.in]: Array.from(validDayOfWeekUsers),
          },
          paused: {
            [Op.eq]: false,
          },
        },
        order: [["createdAt", "ASC"]],
      })) {
        const dmScreenshot = validUserIDs.has(autoItem.userId);
        batchTimes.set(
          [currentTime.hour, currentTime.minute],
          (batchTimes.get([currentTime.hour, currentTime.minute]) || 0) + 1
        );
        await interaction.client.screeningClient.queueDailyAuto(
          await interaction.client.users.fetch(autoItem.userId),
          {
            batchTime: [currentTime.hour, currentTime.minute],
            itemNumber:
              batchTimes.get([currentTime.hour, currentTime.minute]) || 1,
            logChannel,
            dmScreenshot,
            manual: true,
          }
        );
      }
    } catch (e) {
      await logError(e, "triggerAuto", {
        time: {
          hour: currentTime.hour,
          minute: currentTime.minute,
          weekday: currentTime.weekday,
        },
        logChannel: logChannel.id,
      });
    }
  }
}
