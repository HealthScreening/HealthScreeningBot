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
import sleep from "sleep-promise";

import logError from "../utils/logError";
import HealthScreeningBotClient from "./extraClient";

import { setTimeout } from "timers";

export default async function doGuildMemberCacheUpdate(
  client: HealthScreeningBotClient
): Promise<void> {
  try {
    for (const guild of client.guilds.cache.values()) {
      await guild.members.fetch();
      await sleep(10 * 1000);
    }
  } catch (e) {
    await logError(e, "doGuildMemberCacheUpdate");
  }
  setTimeout(() => doGuildMemberCacheUpdate(client), 60 * 60 * 1000);
}
