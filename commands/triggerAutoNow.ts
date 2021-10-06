import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction} from "discord.js";
import {doAllAuto} from "../doAllAuto"
module.exports = {
    data: new SlashCommandBuilder()
        .setName('trigger_auto')
        .setDescription('Run the "auto" screenings now.'),
    async execute(interaction: CommandInteraction) {
        if (interaction.user.id != "199605025914224641"){
            interaction.reply({content: "You are not the bot owner!", ephemeral: true})
        } else {
            await interaction.reply("Starting auto session...")
            await doAllAuto(interaction.client, true)
        }
    },
};
