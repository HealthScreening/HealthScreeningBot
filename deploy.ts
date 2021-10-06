import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const  { discord } = require("./config.json");

const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}



const rest = new REST({ version: '9' }).setToken(discord.token);

(async () => {
    try {
        await rest.put(
            Routes.applicationCommands(discord.clientId),
            { body: commands },
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
})();