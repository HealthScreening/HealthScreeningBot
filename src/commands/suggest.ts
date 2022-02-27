import { SlashCommandBuilder } from "@discordjs/builders";

import { github } from "../../config";
import { Command } from "../client/command";
import { HSBCommandInteraction } from "../discordjs-overrides";
import formatUserIssue from "../utils/formatUserIssue";
import { ItemType, sendMessage } from "../utils/multiMessage";

export default class Suggest extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Make a suggestion for the bot or the bot's server.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message for the suggestion.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("server")
        .setDescription("Whether the suggestion should be for the server.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;
  async execute(interaction: HSBCommandInteraction) {
    const message = interaction.options.getString("message", true);
    const isServer = interaction.options.getBoolean("server", false) ?? false;
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.deferReply({ ephemeral });
    const item: number | null = await interaction.client.githubQueue.enqueue(
      [
        (isServer ? "Server" : "Bot") + " Suggestion",
        formatUserIssue(message, interaction.user),
        isServer ? "serverFeature" : "botFeature",
      ],
      0
    );
    if (item === null) {
      await sendMessage({
        itemType: ItemType.interaction,
        item: interaction,
        content:
          "There was an error while trying to file the suggestion. Please try again later.",
        ephemeral,
      });
      return;
    } else {
      await sendMessage({
        itemType: ItemType.interaction,
        item: interaction,
        content: `Your suggestion has been submitted. You can find it here: https://github.com/${github.owner}/${github.repo}/issues/${item}.`,
        ephemeral,
      });
    }
  }
}
