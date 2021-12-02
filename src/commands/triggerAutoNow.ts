import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction} from "discord.js";
module.exports = {
    data: new SlashCommandBuilder()
        .setName('trigger_auto')
        .setDescription('Run the "auto" screenings now.'),
    async execute(interaction: CommandInteraction) {
        return await interaction.reply({
            content: "This command is currently disabled due to restructuring of the bot. Please wait for functionality to be added again.",
            ephemeral: true
        });
        /*if (interaction.user.id != "199605025914224641"){
            interaction.reply({content: "You are not the bot owner!", ephemeral: true})
        } else {
            await interaction.reply("Starting auto session...")
        }*/
    },
};
