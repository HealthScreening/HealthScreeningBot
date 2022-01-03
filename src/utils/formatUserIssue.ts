/**
 * Copyright (C) 2021-2022 PythonCoderAS
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
import { User } from "discord.js";
import { DateTime } from "luxon";

export default function formatUserIssue(
  message: string,
  user: User,
  type = "Suggestion"
) {
  return `
## ${type} Message

${message
  .split("\n")
  .map((line) => "> " + line)
  .join("\n")}

## ${type} Metadata
Bug Reported By: **${user.username}#${user.discriminator}** (\`${user.id}\`)
Bug Reported At: **${DateTime.local()
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**
`;
}
