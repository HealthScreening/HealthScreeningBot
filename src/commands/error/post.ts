import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Op } from "sequelize";

import { github } from "../../../config";
import { Subcommand } from "../../client/command";
import { HSBCommandInteraction } from "../../discordjs-overrides";
import { ErrorLog } from "../../orm/errorLog";
import formatErrorLogEntry from "../../utils/formatErrorLogEntry";
import { ItemType, sendMessage } from "../../utils/multiMessage";

export default class ErrorPostCommand extends Subcommand {
  registerSubcommand(
    subcommand: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder {
    return subcommand
      .setName("post")
      .setDescription("Post an individual error to GitHub")
      .addIntegerOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the error to post.")
          .setRequired(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("redact")
          .setDescription("Whether to redact the metadata.")
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("ephemeral")
          .setDescription("Whether the contents are hidden to everyone else")
          .setRequired(false)
      );
  }

  async execute(interaction: HSBCommandInteraction): Promise<void> {
    const id: number = interaction.options.getInteger("id", true);
    const redact: boolean =
      interaction.options.getBoolean("redact", false) ?? false;
    const item: ErrorLog | null = await ErrorLog.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    if (!item) {
      await interaction.reply("No error with that ID found.");
      return;
    }

    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.deferReply({ ephemeral });
    const bugItem: number | null = await interaction.client.githubQueue.enqueue(
      [
        `[${item.type}] ${item.errorName}: ${item.errorDescription}`.substring(
          0,
          256
        ),
        formatErrorLogEntry(item, redact),
        "errorLog",
      ],
      2
    );
    if (bugItem === null) {
      await sendMessage({
        itemType: ItemType.interaction,
        item: interaction,
        content:
          "There was an error while trying to post the error. Please try again later.",
        ephemeral,
      });
    } else {
      await sendMessage({
        itemType: ItemType.interaction,
        item: interaction,
        content: `The error log report has been submitted. You can find it here: https://github.com/${github.owner}/${github.repo}/issues/${bugItem}.`,
        ephemeral,
      });
    }
  }
}
