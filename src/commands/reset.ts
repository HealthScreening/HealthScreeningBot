import { SlashCommandBuilder } from "discord.js";

import { Command } from "../client/command";
import { HSBCommandInteraction } from "../discordjs-overrides";
import { AutoDays } from "../orm/autoDays";
import { AutoUser } from "../orm/autoUser";
import { Devices, DevicesAttributes } from "../orm/devices";
import createOrUpdate from "../utils/createOrUpdate";
import { ItemType } from "../utils/multiMessage";

export default class Reset extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("reset")
    .setDescription(
      "Resets all optional information back to defaults, keeping names and email."
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;

  async execute(interaction: HSBCommandInteraction): Promise<void> {
    const autoUser = await AutoUser.findOne({
      where: { userId: interaction.user.id },
    });
    if (!autoUser) {
      await interaction.reply({
        content:
          "You have not set up your auto screening information! Please set it up using `/set_auto`.",
        ephemeral: true,
      });
      return;
    }

    const autoDays = (await AutoDays.findOne({
      where: { userId: interaction.user.id },
    }))!;
    await createOrUpdate<Devices, DevicesAttributes, DevicesAttributes>(
      Devices,
      {
        userId: interaction.user.id,
        device: "iPhone 11",
      },
      { userId: interaction.user.id }
    );
    autoDays.onSunday = false;
    autoDays.onSaturday = false;
    autoDays.onMonday = true;
    autoDays.onTuesday = true;
    autoDays.onWednesday = true;
    autoDays.onThursday = true;
    autoDays.onFriday = true;
    await autoDays.save();
    autoUser.hour = 5;
    autoUser.minute = 40;
    autoUser.type = "G";
    autoUser.emailOnly = false;
    autoUser.paused = false;
    await autoUser.save();
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.reply({
      content: "Reset successful!",
      ephemeral,
    });
    await interaction.followUp({
      content:
        "To make sure email only can be off, I need to check if your DMs are open to the bot.",
      ephemeral,
    });
    try {
      const { user } = interaction;
      await (await user.createDM()).sendTyping();
      await interaction.client.screeningClient.queueAutoCommand(
        interaction.user.id,
        {
          itemType: ItemType.user,
          item: user,
        }
      );
    } catch (e) {
      if (
        e.name === "DiscordAPIError" &&
        e.message === "Cannot send messages to this user"
      ) {
        await interaction.followUp({
          content:
            "I cannot send you a screening, possibly due to DMs being disabled from server members. Therefore, you will be set to email-only screenings. In order to disable email-only mode, please run `/toggle_email_only` after making sure your DMs are open again.",
          ephemeral,
        });
        autoUser.emailOnly = true;
        await autoUser.save();
      } else {
        throw e;
      }
    }
  }
}
