import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

import {generateScreenshot as produceScreenshot, GenerateScreenshotSendableTypeType} from "../utils/produce_screenshot"
import {getScreenshotData, GetScreenshotDataReturnType} from "../getScreenshotData";

const usedRecently: Set<string> = new Set();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate_auto')
        .setDescription('Generate a singular health screening using your auto information.'),
    async execute(interaction: CommandInteraction) {
        let data = await getScreenshotData(interaction.user.id);
        switch (data.type) {
            case GetScreenshotDataReturnType.success:
                const trueData = data.data;
                Object.assign(trueData, {
                    sendable: {type: GenerateScreenshotSendableTypeType.interaction, interaction},
                    cooldownSet: {set: usedRecently, item: interaction.user.id}
                })
                await produceScreenshot(trueData);
                return;
            case GetScreenshotDataReturnType.missingConfig:
                await interaction.reply({
                    content: "You do not have any auto information stored! Use `/set_auto` to set some information.",
                    ephemeral: true
                })
                return;
        }
    },
};
