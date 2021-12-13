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
import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";
import { ErrorLog } from "../../orm/errorLog";

module.exports = {
  name: "view",
  async execute(interaction: CommandInteraction) {
    const id: number = interaction.options.getInteger("id", true);
    const item: ErrorLog | null = await ErrorLog.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    if (!item) {
      return await interaction.reply("No error with that ID found.");
    }
    const embed = new MessageEmbed();
    const embeds = [embed]
    embed.setTitle("Error #" + item.id);
    embed.addFields([
      {
        name: "Type",
        value: item.type,
        inline: false
      },
      {
        name: "Name",
        value: item.errorName,
        inline: false
      }
    ])
    if (item.errorDescription){
      embed.addField("Description", item.errorDescription, false);
    } else {
      embed.addField("Description", "None", false);
    }
    if (item.errorStack){
      const stackEmbed = new MessageEmbed();
      stackEmbed.setTitle("Stack Trace for Error #" + item.id);
      stackEmbed.setDescription("```\n" + item.errorStack + "\n```");
      embeds.push(stackEmbed);
    } else {
      embed.addField("Stack Trace", "None", false);
    }
    embed.addField("Date", DateTime.fromMillis(item.createdAt.getTime()).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS), false);
    embed.addField("Github Issue", item.githubIssueNumber ? "https::/github.com/HealthScreening/HealthScreeningBot/issues/" + item.githubIssueNumber : "None", false);
    if (item.metadata){
      const metadataEmbed = new MessageEmbed();
      metadataEmbed.setTitle("Metadata for Error #" + item.id);
      metadataEmbed.setDescription("```json\n" + JSON.stringify(item.metadata, null, 4) + "\n```");
      embeds.push(metadataEmbed);
    } else {
      embed.addField("Metadata", "None", false);
    }
    return await interaction.reply({ embeds: embeds });
  }
}