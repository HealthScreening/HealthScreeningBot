import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import {Config} from "../orm";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_auto')
        .setDescription('Delete any stored auto information.'),
    async execute(interaction: CommandInteraction) {
        const item = await Config.findOne({where: {userId: interaction.user.id}})
        if (item === null) {
            return await interaction.reply({content: "You do not have any auto information stored! Use `/set_auto` to set some information.", ephemeral: true})
        } else {
            await item.destroy({force: true})
            await interaction.reply("Auto information deleted!")
        }
    }
}