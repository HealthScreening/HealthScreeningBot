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
