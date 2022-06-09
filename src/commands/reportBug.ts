import { SlashCommandBuilder } from "@discordjs/builders";

import { github } from "../../config";
import { Command } from "../client/command";
import { HSBCommandInteraction } from "../discordjs-overrides";
import formatUserIssue from "../utils/formatUserIssue";
import { ItemType, sendMessage } from "../utils/multiMessage";

export default class ReportBug extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("report_bug")
    .setDescription("Report a bug with the bot.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message for the bug report.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;

  async execute(interaction: HSBCommandInteraction) {
    const message = interaction.options.getString("message", true);
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.deferReply({ ephemeral });
    const item: number | null = await interaction.client.githubQueue.enqueue(
      [
        "Bug Report",
        formatUserIssue(message, interaction.user, "Report"),
        "manualBug",
      ],
      1
    );
    if (item === null) {
      await sendMessage({
        itemType: ItemType.interaction,
        item: interaction,
        content:
          "There was an error while trying to report the bug. Please try again later.",
        ephemeral,
      });
    } else {
      await sendMessage({
        itemType: ItemType.interaction,
        item: interaction,
        content: `Your bug report has been submitted. You can find it here: https://github.com/${github.owner}/${github.repo}/issues/${item}.`,
        ephemeral,
      });
    }
  }
}
