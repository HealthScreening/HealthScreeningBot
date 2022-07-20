import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { exit } from "process";

import { closeBrowser } from "@healthscreening/generate-screenshot";

import { Command } from "../client/command";
import checkOwner from "../utils/checkOwner";
import { ItemType } from "../utils/multiMessage";

export default class StopBot extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the bot safely.");

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (
      !(await checkOwner({ itemType: ItemType.interaction, item: interaction }))
    ) {
      return;
    }

    await interaction.reply("Stopping...");
    await closeBrowser();
    await interaction.client.destroy();
    await exit(0);
  }
}
