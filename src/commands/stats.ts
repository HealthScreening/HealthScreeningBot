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

import { Command } from "../client/command";
import { AutoUser } from "../orm/autoUser";

export default class Stats extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Get bot stats.");
  async execute(interaction: CommandInteraction) {
    const guildSize = interaction.client.guilds.cache.size;
    let members = 0;
    interaction.client.guilds.cache.forEach((value) => {
      members += value.memberCount;
    });
    // @ts-ignore: Sequelize provides incorrect types to us
    const timeCounts: {hour: number, minute: number, count: number}[] = await AutoUser.count({
      group: ["hour", "minute"]
    })
    const registeredPeople = timeCounts.map((value) => value.count).reduce((a, b) => a + b, 0);
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Bot Stats")
      .setAuthor({
        name: "Auto Health Screening",
        iconURL:
          "https://cdn.discordapp.com/icons/889983763994521610/43fc775c6dbce5cf84b76f54e8bf5729.webp",
      })
      .addField("Servers", String(guildSize), true)
      .addField("Total Members in All Servers", String(members), true)
      .addField(
        "People Registered for Auto Screenings",
        String(registeredPeople)
      )
      .addField("Unique Screening Times", String(timeCounts.length), true)
      .addField("People Per Screening Time", timeCounts.map((value) => {
        const hour12 = value.hour % 12 || 12;
        const isPM = value.hour >= 12;
        const minutePadded = String(value.minute).padStart(2, "0");
        return `**${
          value.hour
        }:${minutePadded}** (**${hour12}:${minutePadded} ${isPM ? "PM" : "AM"}**: ${value.count}`
      }).join("\n"), false)
      .setTimestamp(DateTime.local().toUTC().toMillis());
    await interaction.reply({ embeds: [embed] });
  }
}
