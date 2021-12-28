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
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Buffer } from "buffer";
import {
  CommandInteraction,
  HTTPAttachmentData,
  MessageEmbed,
} from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";

import { Subcommand } from "../../client/command";
import { ErrorLog } from "../../orm/errorLog";
import { ItemType } from "../../utils/multiMessage";
import Paginator from "../../utils/paginator";

export default class ErrorViewCommand extends Subcommand {
  registerSubcommand(
    subcommand: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder {
    return subcommand
      .setName("view")
      .setDescription("View an individual error")
      .addIntegerOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the error to view.")
          .setRequired(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("paginate")
          .setDescription("Enable pagination")
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("attach")
          .setDescription(
            "Send stack trace and metadata as attachments (will do so anyways if >4096 characters each)."
          )
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("ephemeral")
          .setDescription(
            "Whether or not the contents are hidden to everyone else"
          )
          .setRequired(false)
      );
  }
  async execute(interaction: CommandInteraction) {
    const id: number = interaction.options.getInteger("id", true);
    const attach = interaction.options.getBoolean("attach", false) ?? false;
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    const item: ErrorLog | null = await ErrorLog.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    if (!item) {
      return await interaction.reply({
        content: "No error with that ID found.",
        ephemeral
      });
    }
    const embed = new MessageEmbed();
    const embeds: MessageEmbed[] = [embed];
    const attachments: HTTPAttachmentData[] = [];
    embed.setTitle("Error #" + item.id);
    embed.addFields([
      {
        name: "Type",
        value: item.type,
        inline: false,
      },
      {
        name: "Name",
        value: item.errorName,
        inline: false,
      },
    ]);
    if (item.errorDescription) {
      embed.addField(
        "Description",
        item.errorDescription.substring(0, 1024),
        false
      );
    } else {
      embed.addField("Description", "None", false);
    }
    if (item.errorStack) {
      if (attach || item.errorStack.length > 4096) {
        const stackBuffer = Buffer.from(item.errorStack, "utf8");
        const stackAttachment: HTTPAttachmentData = {
          attachment: stackBuffer,
          name: "stack.txt",
          file: stackBuffer,
        };
        attachments.push(stackAttachment);
      } else {
        const stackEmbed = new MessageEmbed();
        stackEmbed.setTitle("Stack Trace for Error #" + item.id);
        stackEmbed.setDescription("```\n" + item.errorStack + "\n```");
        embeds.push(stackEmbed);
      }
    } else {
      embed.addField("Stack Trace", "None", false);
    }
    embed.addField(
      "Date",
      DateTime.fromMillis(item.createdAt.getTime()).toLocaleString(
        DateTime.DATETIME_HUGE_WITH_SECONDS
      ),
      false
    );
    if (item.metadata) {
      const metadataStrUnformatted = JSON.stringify(item.metadata, null, 4);
      const metadataStr = "```json\n" + metadataStrUnformatted + "\n```";
      if (attach || metadataStr.length > 4096) {
        const metadataBuffer = Buffer.from(metadataStrUnformatted, "utf8");
        const metadataAttachment: HTTPAttachmentData = {
          attachment: metadataBuffer,
          name: "metadata.json",
          file: metadataBuffer,
        };
        attachments.push(metadataAttachment);
      } else {
        const metadataEmbed = new MessageEmbed();
        metadataEmbed.setTitle("Metadata for Error #" + item.id);
        metadataEmbed.setDescription(metadataStr);
        embeds.push(metadataEmbed);
      }
    } else {
      embed.addField("Metadata", "None", false);
    }
    const paginate = interaction.options.getBoolean("paginate", false) ?? true;
    if (paginate) {
      await new Paginator(embeds).send({
        itemType: ItemType.interaction,
        item: interaction,
        ephemeral,
        files: attachments,
      });
    } else {
      return await interaction.reply({
        embeds: embeds,
        ephemeral,
        files: attachments,
      });
    }
  }
}
