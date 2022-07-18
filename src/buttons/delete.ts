import { TextChannel } from "discord.js";

import { HSBMessageComponentInteraction } from "../discordjs-overrides";

async function deleteMessage(interaction: HSBMessageComponentInteraction) {
  const channel = (await interaction.client.channels.fetch(
    interaction.channelId
  )) as TextChannel;
  const message = await channel.messages.fetch(interaction.message.id);
  return message.delete();
}

export default async function deleteButtonBuilder(
  interaction: HSBMessageComponentInteraction
) {
  const { message } = interaction;
  const callerUserId = message.interaction?.user.id;
  if (callerUserId) {
    if (interaction.user.id !== callerUserId) {
      await interaction.reply({
        content: "This is not your interaction!",
        ephemeral: true,
      });
    } else {
      await deleteMessage(interaction);
    }
  } else {
    await deleteMessage(interaction);
  }
}
