import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

const puppeteer = require("puppeteer");

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
    /*const devices = Object.keys(puppeteer.devices);
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
