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
import runSubcommands from "../utils/runSubcommands";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("view_error")
    .setDescription("View a singular error.")
    .addIntegerOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the error to view.")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    return await runSubcommands(this, interaction);
  }
};
