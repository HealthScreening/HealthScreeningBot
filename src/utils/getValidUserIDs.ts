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

import { Client } from "discord.js";

export default function getValidUserIDs(client: Client): Set<string> {
  const validUserIDs: Set<string> = new Set();
  for (const [, guild] of client.guilds.cache) {
    for (const [userId] of guild.members.cache) {
      validUserIDs.add(userId);
    }
  }
  return validUserIDs;
}
