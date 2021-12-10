/**
* Copyright (C) 2021 PythonCoderAS
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { readdirSync } from "fs";

const { discord } = require("../config.json");

/**
 * Gets an array of command definition objects from the command source files located at src/commands.
 * This is the JSON form of the discord.js SlashCommandBuilder class.
 *
 * @return {Object[]} An array of command definition objects.
 */
function getCommands(): Object[] {
    const commands = [];
    const commandFiles = readdirSync("./commands").filter((file) =>
        file.endsWith(".js")
    );

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }
    return commands;
}

const rest = new REST({ version: "9" }).setToken(discord.token);

/**
 * Registers the given commands globally with Discord.
 * On success, logs a success message otherwise logs the error message.
 * @param {Object[]} commands An array of the commands to register, as returned by {@link getCommands}.
 * @return {void} Nothing.
 */
function registerCommands(commands: Object[]): void {
    rest.put(Routes.applicationCommands(discord.clientId), { body: commands })
        .then(() =>
            console.log("Successfully registered application commands.")
        )
        .catch(console.error);
}

registerCommands(getCommands());
