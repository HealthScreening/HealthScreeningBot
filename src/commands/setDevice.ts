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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set_device")
    .setDescription(
      "Set data for the device dimensions to use during health screenings"
    )
    .addStringOption((option) =>
      option
        .setName("device_name")
        .setDescription(
          "The name of the device. Get the device name from the website."
        )
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    return await interaction.reply({
      content:
        "This command is currently disabled due to restructuring of the bot. Please wait for functionality to be added again.",
      ephemeral: true,
    });
    /* const devices = Object.keys(puppeteer.devices);
        const deviceName = interaction.options.getString("device_name")
        if (!devices.includes(deviceName)) {
            return await interaction.reply({
                content: "Invalid device name! Please enter a valid device name. See the list of valid device names at https://pokestarfan.ga/commands/set_device.",
                ephemeral: true
            })
        }
        // await createOrDelete({
        //     device: deviceName, userId: String(interaction.user.id)
        // }, {userId: String(interaction.user.id)})
        await interaction.reply("Device Updated!")*/
  },
};
