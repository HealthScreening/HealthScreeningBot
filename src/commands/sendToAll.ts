import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, User} from "discord.js";
import {Config} from "../orm"

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_to_all')
        .setDescription('Send a message to every person registered in the bot.')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('The message to send')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('The amount of time to wait between messages (in seconds)')
                .setRequired(true)),
    async execute(interaction: CommandInteraction) {
        if (interaction.user.id != "199605025914224641") {
            interaction.reply({content: "You are not the bot owner!", ephemeral: true})
        } else {
            const timeToSleep = interaction.options.getInteger("time")
            await interaction.reply("Sending to all...")
            const validUserIDs = new Set()
            for (const [, guild] of interaction.client.guilds.cache) {
                for (const [userId] of await guild.members.fetch()){
                    validUserIDs.add(userId);
                }
            }
            const items = await Config.findAll()
            let message = `The bot owner has sent a message to everyone registered under the auto health screening bot:\n----\n` +
                    interaction.options.getString("message") +
                    "\n----\nIf you have any questions, contact <@199605025914224641> (PokestarFan#8524).",
                user: User;
            for (const item of items) {
                try {
                    // @ts-ignore
                    if (!validUserIDs.has(item.userId)){
                        continue;
                    }
                    // @ts-ignore
                    user = await interaction.client.users.fetch(item.userId);
                    // @ts-ignore
                    await user.send({
                        "content": message,
                    })
                    await sleep(timeToSleep * 1000);
                } catch (e) {
                    console.error(e)
                }
            }
        }
    },
};
