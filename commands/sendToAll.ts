import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, User} from "discord.js";
import {Config} from "../orm"


module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_to_all')
        .setDescription('Send a message to every person registered in the bot.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        if (interaction.user.id != "199605025914224641") {
            interaction.reply({content: "You are not the bot owner!", ephemeral: true})
        } else {
            await interaction.reply("Sending to all...")
            const items = await Config.findAll()
            let message = `The bot owner has sent a message to everyone registered under the auto health screening bot:\n\n` +
                    interaction.options.getString("message") +
                    "\n\nIf you have any questions, contact <@199605025914224641> (PokestarFan#8524).",
                user: User;
            for (const item of items) {
                try {
                    // @ts-ignore
                    user = await interaction.client.users.fetch(item.userId);
                    // @ts-ignore
                    await user.send({
                        "content": message,
                    })
                } catch (e) {
                    console.error(e)
                }
            }
        }
    },
};
