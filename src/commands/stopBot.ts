import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import {exit} from "process";

import {browser} from "../utils/produce_screenshot"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the bot safely.'),
    async execute(interaction: CommandInteraction) {
        if (interaction.user.id != "199605025914224641") {
            interaction.reply({content: "You are not the bot owner!", ephemeral: true})
        } else {
            await interaction.reply("Stopping...")
            if (browser) {
                await browser.close();
            }
            exit(0)
        }
    },
};
