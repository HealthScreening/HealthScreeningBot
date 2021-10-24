import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

import {Config} from "../orm"

import {generateScreenshot as produceScreenshot, GenerateScreenshotSendableTypeType} from "../produce_screenshot"

export const usedRecently: Set<string> = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate_auto')
        .setDescription('Generate a singular health screening using your auto information.'),
    async execute(interaction: CommandInteraction) {
        const item = await Config.findOne({where: {userId: interaction.user.id}})
        if (item === null) {
            return await interaction.reply({
                content: "You do not have any auto information stored! Use `/set_auto` to set some information.",
                ephemeral: true
            })
        }
        await produceScreenshot({
            // @ts-ignore
            firstName: item.firstName,
            // @ts-ignore
            lastName: item.lastName,
            // @ts-ignore
            email: item.email,
            // @ts-ignore
            isVaxxed: item.vaccinated,
            sendable: {type: GenerateScreenshotSendableTypeType.interaction, interaction},
            cooldownSet: {set: usedRecently, item: interaction.user.id}
        });
    },
};
