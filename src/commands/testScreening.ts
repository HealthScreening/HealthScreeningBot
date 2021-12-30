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
import { CommandInteraction, MessageEmbed } from "discord.js";
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
    .setDescription(
      "See whether or not a screening will occur on the given date."
    )
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
        .setName("paginate")
        .setDescription("Enable pagination")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;
  async execute(interaction: CommandInteraction) {
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
    const embed = new MessageEmbed()
      .setTitle(`Screening Logic for ${month}/${day}/${year}`)
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ format: "jpg" }),
      })
      .setTimestamp(DateTime.local().toUTC().toMillis());
    // Step 1, check the holidays
    const holiday = dayIsHoliday({ year, month, day });
    // Step 2, check if paused
    const paused = autoData.paused;
    // Step 3, check the day
    const weekday = DateTime.fromObject(
      { year, month, day },
      {
        zone: "America/New_York",
      }
    ).weekday;
    let willRunForWeekday = false;
    let weekdayName = "sunday";
    switch (weekday) {
      case 1:
        willRunForWeekday = autoDayData.onMonday;
        weekdayName = "monday";
        break;
      case 2:
        willRunForWeekday = autoDayData.onTuesday;
        weekdayName = "tuesday";
        break;
      case 3:
        willRunForWeekday = autoDayData.onWednesday;
        weekdayName = "wednesday";
        break;
      case 4:
        willRunForWeekday = autoDayData.onThursday;
        weekdayName = "thursday";
        break;
      case 5:
        willRunForWeekday = autoDayData.onFriday;
        weekdayName = "friday";
        break;
      case 6:
        willRunForWeekday = autoDayData.onSaturday;
        weekdayName = "saturday";
        break;
      case 7:
        willRunForWeekday = autoDayData.onSunday;
        break;
    }
    const willRun = !paused && !holiday && willRunForWeekday;
    let action =
      (willRun ? "Will" : "Will not") +
      ` run auto screening for ${month}/${day}/${year}`;
    if (willRun) {
      embed.setColor("GREEN");
    } else {
      embed.setColor("RED");
    }
    embed.addField("Holiday", holiday ? "Yes" : "No", true);
    embed.addField("Paused", paused ? "Yes" : "No", true);
    embed.addField(
      `Will Run on ${weekdayName}`,
      willRunForWeekday ? "Yes" : "No",
      true
    );
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
    const embed2 = new MessageEmbed()
      .setTitle("Screenshot Logic")
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL({ format: "jpg" }),
      })
      .setTimestamp(DateTime.local().toUTC().toMillis());
    // Step 1, check if they share a mutual server.
    // Obviously, if they're running this command then they do in fact share
    // a server with the bot.
    // TODO: Allow arbitrary user IDs to be passed in (owner only), and then this should actually be implemented.
    const mutualServer = true;
    // Step 2, check if email only mode is on.
    const emailOnly = autoData.emailOnly;
    const willEmail = mutualServer && !emailOnly;
    let action2 = (willEmail ? "Will" : "Will not") + ` DM a screenshot`;
    if (willEmail) {
      embed2.setColor("GREEN");
    } else {
      embed2.setColor("RED");
    }
    embed2.addField("Mutual Server", mutualServer ? "Yes" : "No", true);
    embed2.addField("Email Only", emailOnly ? "Yes" : "No", true);
    if (emailOnly) {
      action2 += " because you have **email only** mode on.";
    } else if (!mutualServer) {
      action2 += " because you do not share a mutual server with the bot.";
    } else {
      action2 += ".";
    }
    embed2.setDescription(action2);
    const paginate = interaction.options.getBoolean("paginate", false) ?? true;
    const embeds = [embed, embed2];
    if (paginate) {
      await new Paginator(embeds).send({
        itemType: ItemType.interaction,
        item: interaction,
        ephemeral,
      });
    } else {
      return await interaction.reply({
        embeds: embeds,
        ephemeral,
      });
    }
  }
}
