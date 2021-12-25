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
import { AutoUser } from "../orm/autoUser";
import { AutoDays } from "../orm/autoDays";
import { Command } from "../client/command";

export default class DeleteAuto extends Command {
  readonly data = new SlashCommandBuilder()
    .setName("delete_auto")
    .setDescription("Delete any stored auto information.");
  async execute(interaction: CommandInteraction) {
    const item = await AutoUser.findOne({
      where: { userId: interaction.user.id },
    });
    if (item === null) {
      return await interaction.reply({
        content:
          "You do not have any auto information stored! Use `/set_auto` to set some information.",
        ephemeral: true,
      });
    } else {
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
}
