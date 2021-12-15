import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";
import { ErrorLog } from "../../../orm/errorLog";

module.exports = {
  name: "view",
  async execute(interaction: CommandInteraction) {
    const isDesc = interaction.options.getBoolean("desc", false) || true;
    const whereQuery: { [k: string]: object } = {};
    const before: number | null = interaction.options.getInteger("before");
    const after: number | null = interaction.options.getInteger("after");
    const beforeTime: number | null =
      interaction.options.getInteger("before_time");
    const afterTime: number | null =
      interaction.options.getInteger("after_time");
    const typeStartsWith: string | null =
      interaction.options.getString("type_starts_with");
    const withGithubIssueNumber: boolean | null =
      interaction.options.getBoolean("with_github_issue_number", false);
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
      order: [["createdAt", isDesc ? "DESC" : "ASC"]],
      limit: 25,
    });
    const embed = new MessageEmbed();
    embed.setTitle("Error Log");
    if (items) {
      embed.setDescription(
        items
          .map((item: ErrorLog) => {
            let description = item.errorDescription;
            if (description && description.length > 50) {
              description = description.substring(0, 50) + "...";
            }
            const base = `#${item.id}. ${item.errorName}: ${description}`;
            if (item.githubIssueNumber) {
              return `[${base}](https://github.com/HealthScreening/HealthScreeningBot/issues/${item.githubIssueNumber})`;
            } else {
              return base;
            }
          })
          .join("\n")
      );
      embed.setColor("GREEN");
    } else {
      embed.setDescription("No errors found.");
      embed.setColor("RED");
    }
    let fieldData: string =
      "Direction: **" + (isDesc ? "Descending" : "Ascending") + "**";
    if (before) {
      fieldData += `\nBefore: **#${before}**`;
    } else {
      fieldData += "\nBefore: **None**";
    }
    if (after) {
      fieldData += `\nAfter: **#${after}**`;
    } else {
      fieldData += "\nAfter: **None**";
    }
    if (beforeTime) {
      fieldData += `\nBefore Time: **${DateTime.fromMillis(
        beforeTime * 1000
      ).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**`;
    } else {
      fieldData += "\nBefore Time: **None**";
    }
    if (afterTime) {
      fieldData += `\nAfter Time: **${DateTime.fromMillis(
        afterTime * 1000
      ).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**`;
    } else {
      fieldData += "\nAfter Time: **None**";
    }
    if (typeStartsWith) {
      fieldData += `\nType Starts With: **\`${typeStartsWith}\`**`;
    } else {
      fieldData += "\nType Starts With: **None**";
    }
    if (withGithubIssueNumber) {
      fieldData += `\nWith Github Issue Number: **${withGithubIssueNumber}**`;
    } else {
      fieldData += "\nWith Github Issue Number: **None**";
    }
    embed.addField("Search Properties", fieldData);
    return await interaction.reply({ embeds: [embed] });
  },
};
