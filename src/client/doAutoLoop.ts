import ArrayStringMap from "array-string-map";
import { TextChannel } from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";
import { setTimeout } from "timers";

import { AutoUser } from "../orm/autoUser";
import dayIsHoliday from "../utils/getHolidays";
import getUsersForDayOfWeek from "../utils/getUsersForDayOfWeek";
import logError from "../utils/logError";
import HealthScreeningBotClient from "./extraClient";

export default async function doAutoLoop(
  client: HealthScreeningBotClient,
  logChannel: TextChannel
): Promise<void> {
  const currentTime = DateTime.now().setZone("America/New_York");
  const holiday = dayIsHoliday(currentTime);
  if (!holiday) {
    try {
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
  }

  setTimeout(
    () => doAutoLoop(client, logChannel),
    currentTime.plus({ minutes: 1 }).set({ second: 0 }).toMillis() -
      DateTime.local().setZone("America/New_York").toMillis()
  );
}
