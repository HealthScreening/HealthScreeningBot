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
import { TextChannel } from "discord.js";
import { AutoUser } from "../orm/autoUser";
import { DateTime } from "luxon";
import getUsersForDayOfWeek from "../utils/getUsersForDayOfWeek";
import getValidUserIDs from "../utils/getValidUserIDs";
import { Op } from "sequelize";
import logError from "../utils/logError";
import ArrayStringMap from "array-string-map";

export default async function doAutoLoop(
  client: HealthScreeningBotClient,
  logChannel: TextChannel
): Promise<void> {
  const currentTime = DateTime.now().setZone("America/New_York");
  try {
    const validUserIDs: Set<string> = await getValidUserIDs(client);
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
        hour: {
          [Op.eq]: currentTime.hour,
        },
        minute: {
          [Op.eq]: currentTime.minute,
        },
        paused: {
          [Op.eq]: false,
        },
      },
      order: [["createdAt", "ASC"]],
    })) {
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
  } catch (e) {
    await logError(e, "doAutoLoop", {
      time: {
        hour: currentTime.hour,
        minute: currentTime.minute,
        weekday: currentTime.weekday,
      },
      logChannel: logChannel.id,
    });
  }
  setTimeout(
    () => doAutoLoop(client, logChannel),
    currentTime.plus({ minutes: 1 }).set({second: 0}).toMillis() -
      DateTime.local().setZone("America/New_York").toMillis()
  );
}
