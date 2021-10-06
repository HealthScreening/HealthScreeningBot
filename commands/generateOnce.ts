import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, MessageAttachment} from "discord.js";

import {generateScreenshot as produceScreenshot} from "../produce_screenshot"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate_once')
        .setDescription('Generate a singular health screening')
        .addStringOption(option =>
            option.setName('first_name')
                .setDescription('The first name to specify')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('last_name')
                .setDescription('The last name to specify')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('email')
                .setDescription('The email to specify')
                .setRequired(true))
        .addBooleanOption(option =>
            option.setName("vaccinated")
                .setDescription("Whether or not you are vaccinated.")
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        const firstName = interaction.options.getString("first_name")
        const lastName = interaction.options.getString("last_name")
        const email = interaction.options.getString("email")
        if (!email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)){
            return await interaction.reply("Invalid email! Please enter a valid email.")
        }
        const isVaxxed = interaction.options.getBoolean("vaccinated")
        await interaction.deferReply()
        const buffer = await produceScreenshot(firstName, lastName, email, isVaxxed)
        const attachment = new MessageAttachment(buffer, "screenshot.png")
        const message = `<@${interaction.user.id}>, here's your health screening:`
        // console.debug(`Sending message: ${message}`)
        await interaction.editReply({
            "content": message,
            files: [attachment]
        });
    },
};
