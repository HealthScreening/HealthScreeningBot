import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { AdditionalConfig } from "../orm"
import * as puppeteer from 'puppeteer';

function createOrDelete(values, condition) {
    return AdditionalConfig
        .findOne({ where: condition })
        .then(function(obj) {
            // update
            if(obj)
                return obj.update(values);
            // insert
            return AdditionalConfig.create(values);
        })
}

const devices = Object.keys(puppeteer.devices)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_device')
        .setDescription('Set data for the device dimensions to use during health screenings')
        .addStringOption(option =>
            option.setName('device_name')
                .setDescription('The name of the device. Get the device name from the website.')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const deviceName = interaction.options.getString("device_name")
        if (!devices.includes(deviceName)){
            return await interaction.reply("Invalid device name! Please enter a valid device name. See the list of valid device names at https://pokestarfan.ga/commands/set_device.")
        }
        await createOrDelete({
            device: deviceName, userId: String(interaction.user.id)
        }, {userId: String(interaction.user.id)})
        await interaction.reply("Device Updated!")
    },
};
