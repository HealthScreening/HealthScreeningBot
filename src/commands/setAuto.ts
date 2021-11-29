import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction} from "discord.js";
import { Config } from "../orm"
import {getScreenshotData} from "../getScreenshotData";
import {generateScreenshot as produceScreenshot, GenerateScreenshotSendableTypeType} from "../utils/produce_screenshot";

function createOrDelete(values, condition) {
    return Config
        .findOne({ where: condition })
        .then(function(obj) {
            // update
            if(obj)
                return obj.update(values);
            // insert
            return Config.create(values);
        })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_auto')
        .setDescription('Set data for the automatic screening generator')
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
        await createOrDelete({
            firstName, lastName, email, isVaxxed, userId: String(interaction.user.id)
        }, {userId: String(interaction.user.id)})
        await interaction.reply("Updated! Check your DMs for the confirmation screening.")
        await interaction.user.send("In order to make sure you entered the correct information, a sample screening will be generated for you. If you find any errors, use `/set_auto` again.")
        let data = await getScreenshotData(interaction.user.id);
        await (await interaction.user.createDM()).sendTyping()
        const trueData = data.data;
        Object.assign(trueData, {
            sendable: {type: GenerateScreenshotSendableTypeType.user, user: interaction.user},
        })
        await produceScreenshot(trueData);
    },
};
