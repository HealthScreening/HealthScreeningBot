import { MessageActionRow, MessageButton } from "discord.js";

import { HSBMessageComponentInteraction } from "../discordjs-overrides";

/**
 * Provides a shortcut to go to DMs with the bot.
 */
export default async function goToDMButton(
  interaction: HSBMessageComponentInteraction
) {
  const user = await interaction.client.users.fetch(interaction.user.id);
  const dmChannel = await user.createDM();
  try {
    await dmChannel.send(
      "If you're seeing this as a notification, tap on me to go to bot DMs."
    );
  } catch (e) {
    if (
      e.name === "DiscordAPIError" &&
      e.message === "Cannot send messages to this user"
    ) {
      await interaction.reply({
        content:
          "Your DMs are not open. Please open your DMs first, and then try again.",
        ephemeral: true,
      });
      return;
    }
  }
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
