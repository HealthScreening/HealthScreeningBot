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
import { HSBCommandInteraction } from "../discordjs-overrides";
import { ItemType } from "../utils/multiMessage";
import { Command } from "../client/command";

export default class GenerateAuto extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("generate_auto")
    .setDescription(
      "Generate a singular health screening using your auto information."
    );
  async execute(interaction: HSBCommandInteraction) {
    await interaction.client.screeningClient.queueAutoCommand(
      interaction.user.id,
      {
        itemType: ItemType.interaction,
        item: interaction,
      }
    );
  }
}
