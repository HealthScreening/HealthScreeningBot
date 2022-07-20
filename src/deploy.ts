import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";

import { discord } from "../config";
import HealthScreeningBotClient from "./client/extraClient";

const rest = new REST({ version: "9" }).setToken(discord.token);

function registerCommands(
  commands: RESTPostAPIApplicationCommandsJSONBody[]
): void {
  rest
    .put(Routes.applicationCommands(discord.clientId), { body: commands })
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}

registerCommands(
  new HealthScreeningBotClient({ intents: [] }).commands.map((value) =>
    value.data.toJSON()
  )
);
