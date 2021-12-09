/**
 * Documentation can be found at https://pokestarfan.ga/docs/developer-documentation/api-reference/deploy-ts/.
 */
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { readdirSync } from "fs";

import { discord } from "../config";
import { Command } from "./client/extraClient";

/**
 * Gets an array of command definition objects from the command source files located at src/commands.
 * This is the JSON form of the discord.js SlashCommandBuilder class.
 *
 * @return {Command[]} An array of command definition objects.
 */
function getCommands(): Command[] {
  const commands = [];
  const commandFiles = readdirSync("./commands").filter((file) =>
    file.endsWith(".js")
  );

  for (const file of commandFiles) {
    /* eslint-disable @typescript-eslint/no-var-requires -- Disabled because
      we dynamically require, which is impossible with typescript's import system. */
    const command = require(`./commands/${file}`);
    /* eslint-enable @typescript-eslint/no-var-requires */
    commands.push(command.data.toJSON());
  }
  return commands;
}

const rest = new REST({ version: "9" }).setToken(discord.token);

/**
 * Registers the given commands globally with Discord.
 * On success, logs a success message otherwise logs the error message.
 * @param {Command[]} commands An array of the commands to register, as returned by {@link getCommands}.
 * @return {void} Nothing.
 */
function registerCommands(commands: Command[]): void {
  rest
    .put(Routes.applicationCommands(discord.clientId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}

registerCommands(getCommands());
