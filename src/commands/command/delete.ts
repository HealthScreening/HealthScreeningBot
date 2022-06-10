import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Op } from "sequelize";

import { Subcommand } from "../../client/command";
import { CommandLog } from "../../orm/commandLog";

export default class CommandDeleteCommand extends Subcommand {
  registerSubcommand(
    subcommand: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder {
    return subcommand
      .setName("delete")
      .setDescription("Delete an individual command log entry")
      .addIntegerOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the command log entry to delete.")
          .setRequired(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("ephemeral")
          .setDescription("Whether the contents are hidden to everyone else")
          .setRequired(false)
      );
  }

  async execute(interaction: CommandInteraction): Promise<void> {
    const id: number = interaction.options.getInteger("id", true);
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    const item: CommandLog | null = await CommandLog.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    if (!item) {
      await interaction.reply({
        content: "No command log entry with that ID found.",
        ephemeral,
      });
      return;
    }

    await item.destroy();
    await interaction.reply({
      content: `Deleted command log entry with ID ${id}.`,
      ephemeral,
    });
  }
}
