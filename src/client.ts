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
import { Intents } from "discord.js";
import { init } from "./orm";
import HealthScreeningBotClient from "./client/extraClient";
import {
  closeBrowser,
  startupBrowser,
} from "@healthscreening/generate-screenshot";
import { discord } from "../config";
import logError from "./utils/logError";

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS);
myIntents.add(Intents.FLAGS.GUILD_MEMBERS);
myIntents.add(Intents.FLAGS.GUILD_MESSAGES);
myIntents.add(Intents.FLAGS.DIRECT_MESSAGES);

const client: HealthScreeningBotClient = new HealthScreeningBotClient({
  intents: myIntents,
  partials: ["CHANNEL"],
});

// Login to Discord with your client's token
init()
  .then(() => startupBrowser())
  .then(function () {
    client.login(discord.token);
  })
  .catch((error) => {
    logError(error, "root").then(() => {
      closeBrowser().then(() => {
        process.exit(1);
      });
    });
  });
