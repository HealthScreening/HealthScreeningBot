import { Buffer } from "buffer";
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
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
          .setName("attach")
          .setDescription(
            "Send stack trace and metadata as attachments (will do so anyways if >4096 characters each)."
          )
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("ephemeral")
          .setDescription("Whether the contents are hidden to everyone else")
          .setRequired(false)
      );
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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
      await interaction.reply({
        content: "No error with that ID found.",
        ephemeral,
      });
      return;
    }

    const embed = new EmbedBuilder();
    const embeds: EmbedBuilder[] = [embed];
    const attachments: AttachmentBuilder[] = [];
    embed.setTitle(`Error #${item.id}`);
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
      embed.addFields({
        name: "Description",
        value: item.errorDescription.substring(0, 1024),
        inline: false,
      });
    } else {
      embed.addFields({ name: "Description", value: "None", inline: false });
    }

    if (item.errorStack) {
      if (attach || item.errorStack.length > 4096) {
        const stackBuffer = Buffer.from(item.errorStack, "utf8");
        const stackAttachment: AttachmentBuilder = new AttachmentBuilder(
          stackBuffer
        ).setName("stack.txt");
        attachments.push(stackAttachment);
      } else {
        const stackEmbed = new EmbedBuilder();
        stackEmbed.setTitle(`Stack Trace for Error #${item.id}`);
        stackEmbed.setDescription(`\`\`\`\n${item.errorStack}\n\`\`\``);
        embeds.push(stackEmbed);
      }
    } else {
      embed.addFields({ name: "Stack Trace", value: "None", inline: false });
    }

    embed.addFields({
      name: "Date",
      value: DateTime.fromMillis(item.createdAt.getTime()).toLocaleString(
        DateTime.DATETIME_HUGE_WITH_SECONDS
      ),
      inline: false,
    });
    if (item.metadata) {
      const metadataStrUnformatted = JSON.stringify(item.metadata, null, 4);
      const metadataStr = `\`\`\`json\n${metadataStrUnformatted}\n\`\`\``;
      if (attach || metadataStr.length > 4096) {
        const metadataBuffer = Buffer.from(metadataStrUnformatted, "utf8");
        const metadataAttachment: AttachmentBuilder = new AttachmentBuilder(
          metadataBuffer
        ).setName("metadata.json");
        attachments.push(metadataAttachment);
      } else {
        const metadataEmbed = new EmbedBuilder();
        metadataEmbed.setTitle(`Metadata for Error #${item.id}`);
        metadataEmbed.setDescription(metadataStr);
        embeds.push(metadataEmbed);
      }
    } else {
      embed.addFields({ name: "Metadata", value: "None", inline: false });
    }

    await new Paginator(embeds).send({
      itemType: ItemType.interaction,
      item: interaction,
      ephemeral,
      files: attachments,
    });
  }
}
