/**
 * Documentation can be found at https://pokestarfan.ga/docs/developer-documentation/api-reference/deploy-ts/.
 */
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';

import { readdirSync } from 'fs';

const {discord} = require("../config.json");

function getCommands(): Object[] {
    const commands = [];
    const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    return commands;
}


const rest = new REST({version: '9'}).setToken(discord.token);

function registerCommands(commands: Object[]) {
    rest.put(
        Routes.applicationCommands(discord.clientId),
        {body: commands},
    ).then(() => console.log('Successfully registered application commands.')).catch(console.error)
}

registerCommands(getCommands());