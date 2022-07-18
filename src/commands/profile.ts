import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, EmbedBuilder, User } from "discord.js";
import { DateTime } from "luxon";

import screeningTypes from "@healthscreening/screening-types";

import { Command } from "../client/command";
import { AutoDays } from "../orm/autoDays";
import { AutoUser } from "../orm/autoUser";
import { Devices } from "../orm/devices";
import getAutoData from "../screeningClient/getUserInfo/getAutoData";
import getAutoDayData from "../screeningClient/getUserInfo/getAutoDayData";
import getDeviceData from "../screeningClient/getUserInfo/getDeviceData";

export async function generateProfileEmbed(
  user: User,
  autoUser?: AutoUser,
  autoDays?: AutoDays,
  devices?: Devices
) {
  const autoData = await getAutoData({ userId: user.id }, autoUser);
  const autoDayData = await getAutoDayData({ userId: user.id }, autoDays);
  const deviceData = await getDeviceData({ userId: user.id }, devices);
  const embed = new EmbedBuilder()
    .setColor("GREEN")
    .setTitle("Profile")
    .setAuthor({
      name: user.username,
      iconURL: user.displayAvatarURL({ format: "jpg" }),
    })
    .setTimestamp(DateTime.local().toUTC().toMillis());
  if (autoData) {
    const hour12 = autoData.time.hour % 12 || 12;
    const isPM = autoData.time.hour >= 12;
    const minutePadded = String(autoData.time.minute).padStart(2, "0");
    const autoDataString = `First Name: **${autoData.firstName}**
Last Name: **${autoData.lastName}**
Email: **${autoData.email}**
Vaccinated: **${autoData.vaccinated}**
Screening Time: **${
      autoData.time.hour
    }:${minutePadded}** (**${hour12}:${minutePadded} ${isPM ? "PM" : "AM"}**)
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
  return embed;
}

export default class Profile extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View a summary of auto health screening data.")
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;

  async execute(interaction: CommandInteraction): Promise<void> {
    const embed = await generateProfileEmbed(interaction.user);
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.reply({ embeds: [embed], ephemeral });
  }
}
