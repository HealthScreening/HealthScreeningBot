import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { Op } from "sequelize";

import { Subcommand } from "../../client/command";
import { ErrorLog } from "../../orm/errorLog";

export default class ErrorDeleteCommand extends Subcommand {
  registerSubcommand(
    subcommand: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder {
    return subcommand
      .setName("delete")
      .setDescription("Delete an individual error")
      .addIntegerOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the error to delete.")
          .setRequired(true)
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

    await item.destroy();
    await interaction.reply({
      content: `Deleted error with ID ${id}.`,
      ephemeral,
    });
  }
}
