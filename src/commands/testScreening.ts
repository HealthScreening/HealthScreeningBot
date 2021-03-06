import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { DateTime } from "luxon";

import { Command } from "../client/command";
import getAutoData from "../screeningClient/getUserInfo/getAutoData";
import getAutoDayData from "../screeningClient/getUserInfo/getAutoDayData";
import dayIsHoliday from "../utils/getHolidays";
import { ItemType } from "../utils/multiMessage";
import Paginator from "../utils/paginator";

export default class TestScreening extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("test_screening")
    .setDescription("See whether a screening will occur on the given date.")
    .addIntegerOption((option) =>
      option
        .setName("year")
        .setDescription("The year of the day you intend to get the screening.")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("month")
        .setDescription("The month of the day you intend to get the screening.")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("day")
        .setDescription("The day of the month you intend to get the screening.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const autoData = await getAutoData({ userId: interaction.user.id });
    if (!autoData) {
      await interaction.reply({
        content:
          "You have not set up your auto screening information! Please set it up using `/set_auto`.",
        ephemeral: true,
      });
      return;
    }

    const autoDayData = await getAutoDayData({ userId: interaction.user.id });
    const currentTime = DateTime.local().setZone("America/New_York");
    const year = interaction.options.getInteger("year") || currentTime.year;
    const month = interaction.options.getInteger("month") || currentTime.month;
    const day = interaction.options.getInteger("day") || currentTime.day;
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    const embed = new EmbedBuilder()
      .setTitle(`Screening Logic for ${month}/${day}/${year}`)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ extension: "jpg" }),
      })
      .setTimestamp(DateTime.local().toUTC().toMillis());
    // Step 1, check the holidays
    const holiday = dayIsHoliday({ year, month, day });
    // Step 2, check if paused
    const { paused } = autoData;
    // Step 3, check the day
    const { weekday } = DateTime.fromObject(
      { year, month, day },
      {
        zone: "America/New_York",
      }
    );
    let willRunForWeekday = false;
    let weekdayName = "Sunday";
    switch (weekday) {
      case 1:
        willRunForWeekday = autoDayData.onMonday;
        weekdayName = "Monday";
        break;
      case 2:
        willRunForWeekday = autoDayData.onTuesday;
        weekdayName = "Tuesday";
        break;
      case 3:
        willRunForWeekday = autoDayData.onWednesday;
        weekdayName = "Wednesday";
        break;
      case 4:
        willRunForWeekday = autoDayData.onThursday;
        weekdayName = "Thursday";
        break;
      case 5:
        willRunForWeekday = autoDayData.onFriday;
        weekdayName = "Friday";
        break;
      case 6:
        willRunForWeekday = autoDayData.onSaturday;
        weekdayName = "Saturday";
        break;
      case 7:
        willRunForWeekday = autoDayData.onSunday;
        break;
      default:
        await interaction.reply({
          content: `Invalid date entered: ${month}/${day}/${year}`,
          ephemeral: true,
        });
        return;
    }

    const willRun = !paused && !holiday && willRunForWeekday;
    let action = `${
      willRun ? "Will" : "Will not"
    } run auto screening for ${month}/${day}/${year}`;
    if (willRun) {
      embed.setColor("Green");
    } else {
      embed.setColor("Red");
    }

    embed.addFields([
      { name: "Holiday", value: holiday ? "Yes" : "No", inline: true },
      { name: "Paused", value: paused ? "Yes" : "No", inline: true },
      {
        name: `Will Run on ${weekdayName}`,
        value: willRunForWeekday ? "Yes" : "No",
        inline: true,
      },
    ]);
    if (paused) {
      action += " because you have **paused** it.";
    } else if (holiday) {
      action += ` because it is the holiday **${holiday.name}**.`;
    } else if (!willRunForWeekday) {
      action += ` because you have auto screenings **disabled** for **${weekdayName}**.`;
    } else {
      action += ".";
    }

    embed.setDescription(action);
    const embed2 = new EmbedBuilder()
      .setTitle("Screenshot Logic")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ extension: "jpg" }),
      })
      .setTimestamp(DateTime.local().toUTC().toMillis());
    // Step 1, check if email only mode is on.
    const { emailOnly } = autoData;
    const willEmail = !emailOnly;
    let action2 = `${willEmail ? "Will" : "Will not"} DM a screenshot`;
    if (willEmail) {
      embed2.setColor("Green");
    } else {
      embed2.setColor("Red");
    }

    embed2.addFields({
      name: "Email Only",
      value: emailOnly ? "Yes" : "No",
      inline: true,
    });
    if (emailOnly) {
      action2 += " because you have **email only** mode on.";
    } else {
      action2 += ".";
    }

    embed2.setDescription(action2);
    const embeds = [embed, embed2];
    await new Paginator(embeds).send({
      itemType: ItemType.interaction,
      item: interaction,
      ephemeral,
    });
  }
}
