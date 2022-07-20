import { SlashCommandBuilder } from "discord.js";

import { Command } from "../client/command";
import { HSBCommandInteraction } from "../discordjs-overrides";
import { ItemType } from "../utils/multiMessage";

export default class GenerateAuto extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("generate_auto")
    .setDescription(
      "Generate a singular health screening using your auto information."
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;

  async execute(interaction: HSBCommandInteraction): Promise<void> {
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.client.screeningClient.queueAutoCommand(
      interaction.user.id,
      {
        itemType: ItemType.interaction,
        item: interaction,
        ephemeral,
      }
    );
  }
}
