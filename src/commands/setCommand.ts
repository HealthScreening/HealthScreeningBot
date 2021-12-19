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
import screeningTypes, { screeningTypeType } from "@healthscreening/screening-types";
import { CommandInteraction } from "discord.js";
import { devices } from "puppeteer";
import createOrUpdate from "../utils/createOrUpdate";
import { Devices, DevicesAttributes } from "../orm/devices";
import { AutoUser } from "../orm/autoUser";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set")
    .setDescription(
      "Set optional heatlh screening data"
    )
    .addStringOption((option) => option
      .setName("device")
      .setDescription(
        "The name of the device to use. Use `/device_list` to get a list of various devices."
      )
      .setRequired(false)
    )
    .addIntegerOption((option) => option
      .setName("hour")
      .setDescription(
        "The hour to run the screening at. Must a number in the range 0-23."
      )
      .setRequired(false)
    )
    .addIntegerOption((option) => option
      .setName("minute")
      .setDescription(
        "The minute to run the screening at. Must a number in the range 0-59."
      )
      .setRequired(false)
    ).addStringOption((option) => option
      .setName("type")
      .setDescription("The type of screening to generate. Defaults to 'Guest'.")
      .setRequired(false)
      .addChoices(Object.entries(screeningTypes).map(([key, value]) => [value, key]))
    ).addBooleanOption((option) => option
      .setName("emailOnly")
      .setDescription("Whether the screening should be email only (meaning a screenshot is not DMed to you).")
      .setRequired(false)
    ).addBooleanOption((option) => option
      .setName("paused")
      .setDescription("Whether auto screenings should be paused.")
      .setRequired(false)
    ),
  async execute(interaction: CommandInteraction) {
    const validDevices = Object.keys(devices);
    const deviceName = interaction.options.getString("device");
    const hour = interaction.options.getInteger("hour");
    const minute = interaction.options.getInteger("minute");
    const type = interaction.options.getString("type");
    const emailOnly = interaction.options.getBoolean("emailOnly");
    const paused = interaction.options.getBoolean("paused");

    if (deviceName && !validDevices.includes(deviceName)) {
      return await interaction.reply({
        content: "Invalid device name! Please enter a valid device name. See the list of valid device names by using the `/device_list` command.",
        ephemeral: true
      });
    }
    const userOptions = await AutoUser.findOne({
      where: {
        userId: interaction.user.id
      }
    });
    if (!userOptions && (hour || minute || type || emailOnly || paused)) {
      return await interaction.reply({
        content: "You must first auto information using the `/set_auto` command.",
        ephemeral: true
      });
    }
    if (hour && (hour < 0 || hour > 23)) {
      return await interaction.reply({
        content: "Invalid hour! Please enter a valid hour in the range [0, 23].",
        ephemeral: true
      });
    }
    if (minute && (minute < 0 || minute > 59)) {
      return await interaction.reply({
        content: "Invalid minute! Please enter a valid minute in the range [0, 59].",
        ephemeral: true
      });
    }
    if (deviceName) {
      await createOrUpdate<Devices, DevicesAttributes, DevicesAttributes>(Devices, {
        userId: interaction.user.id,
        device: deviceName
      }, { userId: interaction.user.id });
    }
    if (userOptions) {
      if (hour) {
        userOptions.hour = hour;
      }
      if (minute) {
        userOptions.minute = minute;
      }
      if (type) {
        userOptions.type = type as screeningTypeType;
      }
      if (emailOnly) {
        userOptions.emailOnly = emailOnly;
      }
      if (paused) {
        userOptions.paused = paused;
      }
      await userOptions.save();
    }
    return await interaction.reply({
      content: "Successfully set new information!",
      ephemeral: true
    });
  }
};
