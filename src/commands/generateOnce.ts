import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

import {generateScreenshot as produceScreenshot, GenerateScreenshotSendableTypeType} from "../utils/produce_screenshot"
import {AdditionalConfig} from "../orm";

const usedRecently: Set<string> = new Set();

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
        if (!email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)) {
            return await interaction.reply("Invalid email! Please enter a valid email.")
        }
        const isVaxxed = interaction.options.getBoolean("vaccinated")
        const additionalItem = await AdditionalConfig.findOne({where: {userId: interaction.user.id}});
        let deviceName = undefined;
        // @ts-ignore
        if (additionalItem && additionalItem.device){
            // @ts-ignore
            deviceName = additionalItem.device;
        }
        await produceScreenshot({
            firstName: firstName,
            lastName: lastName,
            email: email,
            isVaxxed: isVaxxed,
            sendable: {type: GenerateScreenshotSendableTypeType.interaction, interaction},
            cooldownSet: {set: usedRecently, item: interaction.user.id},
            deviceName: deviceName
        })
    },
};
