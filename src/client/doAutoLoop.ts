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
import HealthScreeningBotClient from "./extraClient";
import { sequelize } from "../orm";
import { TextChannel } from "discord.js";
import { AutoUser } from "../orm/autoUser";
import { DateTime } from "luxon";
import getUsersForDayOfWeek from "../utils/getUsersForDayOfWeek";
import getValidUserIDs from "../utils/getValidUserIDs";

export default async function doAutoLoop(
  client: HealthScreeningBotClient,
  logChannel: TextChannel
): Promise<void> {
  console.debug("Starting auto loop");
  const validUserIDs: Set<string> = await getValidUserIDs(client);
  const batchTimes: Map<[number, number], number> = new Map();
  const currentTime = DateTime.now().setZone("America/New_York");
  const currentTimeMins = currentTime.hour * 60 + currentTime.minute;
  const validDayOfWeekUsers = new Set(
    await getUsersForDayOfWeek(currentTime.weekday)
  );
  console.debug(
    "Found %s valid users for weekday %s",
    validDayOfWeekUsers.size,
    currentTime.weekday
  );
  for (const autoItem of await sequelize.query(
    `SELECT *
     FROM "AutoUsers"
     WHERE ("AutoUsers".hour * 60 + "AutoUsers".minute) BETWEEN ? AND ?`,
    {
      replacements: [currentTimeMins, currentTimeMins + 5],
      mapToModel: true,
      model: AutoUser,
    }
  )) {
    if (!validDayOfWeekUsers.has(autoItem.userId)) {
      continue;
    }
    console.log("Processing user %s", autoItem.userId);
    const dmScreenshot = validUserIDs.has(autoItem.userId);
    batchTimes.set(
      [autoItem.hour, autoItem.minute],
      (batchTimes.get([autoItem.hour, autoItem.minute]) || 0) + 1
    );
    await client.screeningClient.queueDailyAuto(
      await client.users.fetch(autoItem.userId),
      {
        batchTime: [autoItem.hour, autoItem.minute],
        itemNumber: batchTimes.get([autoItem.hour, autoItem.minute]) || 1,
        logChannel,
        dmScreenshot,
      }
    );
  }
  setTimeout(() => doAutoLoop(client, logChannel), 5 * 60 * 1000);
}
