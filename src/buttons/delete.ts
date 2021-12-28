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
import { TextChannel } from "discord.js";

import { HSBMessageComponentInteraction } from "../discordjs-overrides";

async function deleteMessage(interaction: HSBMessageComponentInteraction) {
  const channel = (await interaction.client.channels.fetch(
    interaction.channelId
  )) as TextChannel;
  const message = await channel.messages.fetch(interaction.message.id);
  return await message.delete();
}

export default async function deleteButton(
  interaction: HSBMessageComponentInteraction
) {
  const message = interaction.message;
  const callerUserId = message.interaction?.user.id;
  if (callerUserId) {
    if (interaction.user.id !== callerUserId) {
      await interaction.reply({
        content: "This is not your interaction!",
        ephemeral: true,
      });
      return;
    } else {
      await deleteMessage(interaction);
    }
  } else {
    await deleteMessage(interaction);
  }
}
