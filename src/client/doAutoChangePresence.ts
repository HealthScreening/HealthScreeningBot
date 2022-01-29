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
import HealthScreeningBotClient from "./extraClient";

export default async function doAutoChangePresence(
  client: HealthScreeningBotClient,
): Promise<void> {

  const guildSize = client.guilds.cache.size;
  const registeredPeople = await AutoUser.count()
      .map((value) => value.count)
      .reduce((a, b) => a + b, 0);
      
  const presences: string[] = 
[
  "Generating Health Screenings",
  `In ${guildSize} servers`,
  "Generating for ${registeredPeople} people!",
  "/generate name:walkthrough for walkthrough of commands!",
  "Report a bug with /report_bug!",
  "Use /set to set optional configuration info!",
  "can i put ma balls on ya jaws",
  "Run /stats for cool stats about the bot!",
  "Check out your profile with /profile!",
  "Have an idea? Suggest it with /suggest!",
];

  await client.user.setPresence(presences[Math.floor(Math.random() * presences.length)]);
  
  setTimeout(
    () => doAutoChangePresence(client), 300000)
}
