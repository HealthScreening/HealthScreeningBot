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
import { exit } from "process";

import { closeBrowser } from "@healthscreening/generate-screenshot";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop the bot safely."),
  async execute(interaction: CommandInteraction) {
    if (interaction.user.id != "199605025914224641") {
      interaction.reply({
        content: "You are not the bot owner!",
        ephemeral: true,
      });
    } else {
      await interaction.reply("Stopping...");
      await closeBrowser();
      exit(0);
    }
  },
};
