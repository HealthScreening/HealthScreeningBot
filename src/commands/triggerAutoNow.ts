import { SlashCommandBuilder } from "@discordjs/builders";
import ArrayStringMap from "array-string-map";
import { TextChannel } from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";

import { Command } from "../client/command";
import { HSBCommandInteraction } from "../discordjs-overrides";
import { AutoUser } from "../orm/autoUser";
import checkOwner from "../utils/checkOwner";
import getUsersForDayOfWeek from "../utils/getUsersForDayOfWeek";
import logError from "../utils/logError";
import { ItemType } from "../utils/multiMessage";

export default class TriggerAutoNow extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("trigger_auto")
    .setDescription("Run the auto screenings now.")
    .addBooleanOption((option) =>
      option
        .setName("skip_paused")
        .setDescription("Skip the apused check.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("skip_day")
        .setDescription("Skip the day check.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("skip_email_only")
        .setDescription("Skip the email-only check.")
        .setRequired(false)
    ) as SlashCommandBuilder;

  async execute(interaction: HSBCommandInteraction): Promise<void> {
    if (
      !(await checkOwner({ itemType: ItemType.interaction, item: interaction }))
    ) {
      return;
    }

    const skipPaused =
      interaction.options.getBoolean("skip_paused", false) ?? false;
    const skipDay = interaction.options.getBoolean("skip_day", false) ?? false;
    const skipEmailOnly =
      interaction.options.getBoolean("skip_email_only", false) ?? false;
    await interaction.reply("Starting auto session...");
    const logChannel: TextChannel = (await (
      await interaction.client.guilds.fetch("889983763994521610")
    ).channels.fetch("902375187150934037")) as TextChannel;
    const currentTime = DateTime.now().setZone("America/New_York");
    try {
      const batchTimes: ArrayStringMap<[number, number], number> =
        new ArrayStringMap();
      const validDayOfWeekUsers = new Set(
        await getUsersForDayOfWeek(currentTime.weekday)
      );
      const whereData: { [k: string]: object } = {};
      if (!skipDay) {
        whereData.userId = {
          [Op.in]: Array.from(validDayOfWeekUsers),
        };
      }

      if (!skipPaused) {
        whereData.paused = {
          [Op.eq]: false,
        };
      }

      for (const autoItem of await AutoUser.findAll({
        where: whereData,
        order: [["createdAt", "ASC"]],
      })) {
        const dmScreenshot = skipEmailOnly ? true : undefined;
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
