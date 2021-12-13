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
import { Op } from "sequelize";
import { ErrorLog } from "../orm/errorLog";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view_error_log")
    .setDescription("View the bot's error log.")
    .addIntegerOption((option) =>
      option
        .setName("before")
        .setDescription("Show the errors before this error #")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("after")
        .setDescription("Show the errors after this error #")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("after_time")
        .setDescription("Show errors after the given UNIX timestamp")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("before_time")
        .setDescription("Show errors before the given UNIX timestamp")
        .setRequired(false)
    ).addBooleanOption((option) =>
      option
        .setName("desc")
        .setDescription("Show the errors in descending order, default true")
        .setRequired(false)
    ).addBooleanOption((option) =>
      option
        .setName("with_github_issue_number")
        .setDescription("Show the errors with github issue numbers, default false")
        .setRequired(false)
    ).addStringOption((option) =>
      option
        .setName("type_starts_with")
        .setDescription("Shows the errors with a type starting with the given string")
        .setRequired(false)),
  async execute(interaction: CommandInteraction) {
    const isDesc = interaction.options.getBoolean("desc", false) || true;
    const whereQuery: { [k: string]: object } = {};
    const before: number | null = interaction.options.getInteger("before");
    const after: number | null = interaction.options.getInteger("after");
    const beforeTime: number | null = interaction.options.getInteger("before_time");
    const afterTime: number | null = interaction.options.getInteger("after_time");
    const typeStartsWith: string | null = interaction.options.getString("type_starts_with");
    const withGithubIssueNumber: boolean | null = interaction.options.getBoolean(
      "with_github_issue_number",
      false
    );
    if (before) {
      if (!whereQuery.id) {
        whereQuery.id = {};
      }
      whereQuery.id[Op.lt] = before;
    }
    if (after) {
      if (!whereQuery.id) {
        whereQuery.id = {};
      }
      whereQuery.id[Op.gt] = after;
    }
    if (beforeTime) {
      if (!whereQuery.createdAt) {
        whereQuery.createdAt = {};
      }
      whereQuery.createdAt[Op.lt] = new Date(beforeTime * 1000);
    }
    if (afterTime) {
      if (!whereQuery.createdAt) {
        whereQuery.createdAt = {};
      }
      whereQuery.createdAt[Op.gt] = new Date(afterTime * 1000);
    }
    if (typeStartsWith) {
      if (!whereQuery.type) {
        whereQuery.type = {};
      }
      whereQuery.type[Op.startsWith] = typeStartsWith;
    }
    if (withGithubIssueNumber) {
      if (!whereQuery.githubIssueNumber) {
        whereQuery.githubIssueNumber = {};
      }
      whereQuery.githubIssueNumber[Op.eq] = withGithubIssueNumber;
    }
    const items: ErrorLog[] = await ErrorLog.findAll({
      where: whereQuery,
      order: [
        ["createdAt", isDesc ? "DESC" : "ASC"]
      ],
      limit: 25
    });
    const embed = new MessageEmbed();
    embed.setTitle("Error Log");
    if (items) {
      embed.setDescription(
        items.map((item: ErrorLog) => {
          const base = `#${item.id}. ${item.errorName}`;
          if (item.githubIssueNumber) {
            return `[${base}](https://github.com/HealthScreening/HealthScreeningBot/issues/${item.githubIssueNumber})`;
          }
          else {
            return base;
          }
        }).join("\n")
      );
      embed.setColor("GREEN");
    }
    else {
      embed.setDescription("No errors found.");
      embed.setColor("RED");
    }
    let fieldData: string = "Direction: **" + (isDesc ? "Descending" : "Ascending") + "**";
    if (before) {
      fieldData += `\nBefore: **#${before}**`;
    }
    else {
      fieldData += "\nBefore: **None**";
    }
    if (after) {
      fieldData += `\nAfter: **#${after}**`;
    }
    else {
      fieldData += "\nAfter: **None**";
    }
    if (beforeTime) {
      fieldData += `\nBefore Time: **${DateTime.fromMillis(beforeTime * 1000).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**`;
    }
    else {
      fieldData += "\nBefore Time: **None**";
    }
    if (afterTime) {
      fieldData += `\nAfter Time: **${DateTime.fromMillis(afterTime * 1000).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**`;
    }
    else {
      fieldData += "\nAfter Time: **None**";
    }
    if (typeStartsWith) {
      fieldData += `\nType Starts With: **\`${typeStartsWith}\`**`;
    }
    else {
      fieldData += "\nType Starts With: **None**";
    }
    if (withGithubIssueNumber) {
      fieldData += `\nWith Github Issue Number: **${withGithubIssueNumber}**`;
    }
    else {
      fieldData += "\nWith Github Issue Number: **None**";
    }
    embed.addField("Search Properties", fieldData);
    return await interaction.reply({ embeds: [embed] });
  }
};
