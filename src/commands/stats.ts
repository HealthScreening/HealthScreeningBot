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
import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { AutoUser } from "../orm/autoUser";
import { Command } from "../client/command";

export default class Stats extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Get bot stats.")
  async execute(interaction: CommandInteraction) {
    const guildSize = interaction.client.guilds.cache.size;
    let members = 0;
    interaction.client.guilds.cache.forEach((value) => {
      members += value.memberCount;
    });
    const registeredPeople = await AutoUser.count();
    const embed = new MessageEmbed()
      .setColor("#00FF00")
      .setTitle("Bot Stats")
      .setAuthor(
        "Auto Health Screening",
        "https://cdn.discordapp.com/icons/889983763994521610/43fc775c6dbce5cf84b76f54e8bf5729.webp"
      )
      .addField("Servers", String(guildSize), true)
      .addField("Total Members in All Servers", String(members), true)
      .addField(
        "People Registered for Auto Screenings",
        String(registeredPeople)
      )
      .setTimestamp(DateTime.local().toUTC().toMillis());
    await interaction.reply({ embeds: [embed] });
  }
}