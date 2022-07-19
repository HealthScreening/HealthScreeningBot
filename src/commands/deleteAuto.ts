import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import { Command } from "../client/command";
import { AutoDays } from "../orm/autoDays";
import { AutoUser } from "../orm/autoUser";

export default class DeleteAuto extends Command {
  readonly data = new SlashCommandBuilder()
    .setName("delete_auto")
    .setDescription("Delete any stored auto information.");

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const item = await AutoUser.findOne({
      where: { userId: interaction.user.id },
    });
    if (item === null) {
      await interaction.reply({
        content:
          "You do not have any auto information stored! Use `/set_auto` to set some information.",
        ephemeral: true,
      });
      return;
    }

    await item.destroy({ force: true });
    const dayItem = await AutoDays.findOne({
      where: { userId: interaction.user.id },
    });
    if (dayItem !== null) {
      await dayItem.destroy({ force: true });
    }

    await interaction.reply("Auto information deleted!");
  }
}
