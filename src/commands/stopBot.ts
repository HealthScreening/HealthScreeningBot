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
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Command } from "../client/command";
import checkOwner from "../utils/checkOwner";
import { ItemType } from "../utils/multiMessage";
import { closeBrowser } from "@healthscreening/generate-screenshot";
import { exit } from "process";

export default class StopBot extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the bot safely.");
  async execute(interaction: CommandInteraction) {
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
