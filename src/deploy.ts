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
import {
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
} from "discord-api-types/v9";

import { readdirSync } from "fs";
import { resolve } from "path";

import { discord } from "../config";
import { Command } from "./client/extraClient";

const commandPathBase = resolve(__dirname, "commands");

/**
 * Gets an array of command definition objects from the command source files located at src/commands.
 * This is the JSON form of the discord.js SlashCommandBuilder class.
 *
 * @return {Command[]} An array of command definition objects.
 */
function getCommands(): RESTPostAPIApplicationCommandsJSONBody[] {
  const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  const commandFiles = readdirSync(commandPathBase).filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    /* eslint-disable @typescript-eslint/no-var-requires -- Disabled because
      we dynamically require, which is impossible with typescript's import system. */
    const command: Command = require(resolve(commandPathBase, file));
    /* eslint-enable @typescript-eslint/no-var-requires */
    commands.push(command.data.toJSON());
  }
  return commands;
}

const rest = new REST({ version: "9" }).setToken(discord.token);

/**
 * Registers the given commands globally with Discord.
 * On success, logs a success message otherwise logs the error message.
 * @param {RESTPostAPIApplicationCommandsJSONBody[]} commands An array of the commands to register, as returned by {@link getCommands}.
 * @return {void} Nothing.
 */
function registerCommands(
  commands: RESTPostAPIApplicationCommandsJSONBody[]
): void {
  rest
    .put(Routes.applicationCommands(discord.clientId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}

registerCommands(getCommands());
