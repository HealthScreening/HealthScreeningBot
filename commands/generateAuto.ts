import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, MessageAttachment} from "discord.js";

import {Config} from "../orm"

import {generateScreenshot as produceScreenshot} from "../produce_screenshot"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate_auto')
        .setDescription('Generate a singular health screening using your auto information.'),
    async execute(interaction: CommandInteraction) {
        const item = await Config.findOne({where: {userId: interaction.user.id}})
        if (item === null) {
            return await interaction.reply({content: "You do not have any auto information stored! Use `/set_auto` to set some information.", ephemeral: true})
        }
        await interaction.deferReply()
        // @ts-ignore
        const screenshot = await produceScreenshot(item.firstName, item.lastName, item.email, item.vaccinated);
        const attachment = new MessageAttachment(screenshot, "screenshot.png")
        const message = `<@${interaction.user.id}>, here's your health screening:`
        // console.debug(`Sending message: ${message}`)
        await interaction.editReply({
            "content": message,
            files: [attachment]
        });
    },
};
