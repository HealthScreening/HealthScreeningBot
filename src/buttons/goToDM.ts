import { MessageActionRow, MessageButton } from "discord.js";

import { HSBMessageComponentInteraction } from "../discordjs-overrides";

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
