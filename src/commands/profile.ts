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
import screeningTypes from "@healthscreening/screening-types";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import getAutoData from "../screeningClient/getUserInfo/getAutoData";
import getAutoDayData from "../screeningClient/getUserInfo/getAutoDayData";
import getDeviceData from "../screeningClient/getUserInfo/getDeviceData";
import { Command } from "../client/command";

export default class Profile extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Saw profile.")
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether to hide this message.")
        .setRequired(true)
    ) as SlashCommandBuilder;
  async execute(interaction: CommandInteraction) {
    const isEphemeral = interaction.options.getBoolean("ephemeral")!;
    const autoData = await getAutoData({ userId: interaction.user.id });
    const autoDayData = await getAutoDayData({ userId: interaction.user.id });
    const deviceData = await getDeviceData({ userId: interaction.user.id });
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Profile")
      .setAuthor(
        interaction.user.username,
        interaction.user.displayAvatarURL({ format: "jpg" })
      )
      .setTimestamp(DateTime.local().toUTC().toMillis());
    if (autoData) {
      const autoDataString = `First Name: **${autoData.firstName}**
Last Name: **${autoData.lastName}**
Email: **${autoData.email}**
Vaccinated: **${autoData.vaccinated}**
Screening Time: **${autoData.time.hour}:${autoData.time.minute}**
Screening Type: **${screeningTypes[autoData.type]}**
Email Only: **${autoData.emailOnly}**
Screenings Paused: **${autoData.paused}**`;
      embed.addField("Auto Data", autoDataString);
    } else {
      embed.addField("Auto", "**No data**");
    }
    if (autoDayData) {
      const autoDayDataString = `Screening Sent on Sunday: **${autoDayData.onSunday}**
Screening Sent on Monday: **${autoDayData.onMonday}**
Screening Sent on Tuesday: **${autoDayData.onTuesday}**
Screening Sent on Wednesday: **${autoDayData.onWednesday}**
Screening Sent on Thursday: **${autoDayData.onThursday}**
Screening Sent on Friday: **${autoDayData.onFriday}**
Screening Sent on Saturday: **${autoDayData.onSaturday}**`;
      embed.addField("Auto Day Data", autoDayDataString);
    } else {
      embed.addField("Auto Day", "**No data**");
    }
    embed.addField("Device Used for Screenings", deviceData.device);
    await interaction.reply({ embeds: [embed], ephemeral: isEphemeral });
  }
}
