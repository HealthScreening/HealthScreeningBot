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
import { MessageActionRow, MessageButton } from "discord.js";

import { HSBMessageComponentInteraction } from "../discordjs-overrides";

// Provides a shortcut to view DMs with the bot

export default async function goToDMButton(
  interaction: HSBMessageComponentInteraction
) {
  const user = await interaction.client.users.fetch(interaction.user.id);
  const dmChannel = await user.createDM();
  await interaction.reply({
    content:
      "Click the button below to go to your direct message channel with the bot.",
    ephemeral: true,
    components: [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setURL("https://discord.com/channels/@me/" + dmChannel.id)
          .setLabel("Click to Open DM")
          .setStyle("LINK")
      ),
    ],
  });
}
