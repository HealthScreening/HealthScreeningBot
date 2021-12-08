/**
 * Documentation can be found at https://pokestarfan.ga/docs/developer-documentation/api-reference/deploy-ts/.
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
    file.endsWith(".js"),
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
  rest
    .put(Routes.applicationCommands(discord.clientId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}

registerCommands(getCommands());
