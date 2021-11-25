import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed} from "discord.js";
import { DateTime } from "luxon";

import {Config} from "../orm"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Get bot stats.'),
    async execute(interaction: CommandInteraction) {
        const guildSize = interaction.client.guilds.cache.size
        let members: number = 0
        interaction.client.guilds.cache.forEach((value) => {
            members += value.memberCount;
        })
        const registeredPeople = await Config.count()
        const embed = new MessageEmbed()
            .setColor("#00FF00")
            .setTitle("Bot Stats")
            .setAuthor("Auto Health Screening", "https://cdn.discordapp.com/icons/889983763994521610/43fc775c6dbce5cf84b76f54e8bf5729.webp")
            .addField("Servers", String(guildSize), true)
            .addField("Total Members in All Servers", String(members), true)
            .addField("People Registered for Auto Screenings", String(registeredPeople))
            .setTimestamp(DateTime.local().toUTC().toMillis())
        interaction.reply({embeds: [embed]})
    },
};
