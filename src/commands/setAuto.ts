import { SlashCommandBuilder } from "@discordjs/builders";
import { User } from "discord.js";

import { Command } from "../client/command";
import { HSBCommandInteraction } from "../discordjs-overrides";
import {
  AutoDays,
  AutoDaysAttributes,
  AutoDaysCreationAttributes,
} from "../orm/autoDays";
import {
  AutoUser,
  AutoUserAttributes,
  AutoUserCreationAttributes,
} from "../orm/autoUser";
import createOrUpdate from "../utils/createOrUpdate";
import { ItemType, sendMessage } from "../utils/multiMessage";

export default class SetAuto extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("set_auto")
    .setDescription("Set data for the automatic screening generator")
    .addStringOption((option) =>
      option
        .setName("first_name")
        .setDescription("The first name to specify")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("last_name")
        .setDescription("The last name to specify")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("email")
        .setDescription("The email to specify")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("vaccinated")
        .setDescription("Whether you are vaccinated.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;
  async execute(interaction: HSBCommandInteraction) {
    const firstName = interaction.options.getString("first_name")!;
    const lastName = interaction.options.getString("last_name")!;
    const email = interaction.options.getString("email")!;
    if (
      !email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)
    ) {
      return await interaction.reply({
        content: "Invalid email! Please enter a valid email.",
        ephemeral: true,
      });
    }
    const isVaxxed = interaction.options.getBoolean("vaccinated")!;
    const autoUserObj = await createOrUpdate<
      AutoUser,
      AutoUserAttributes,
      AutoUserCreationAttributes
    >(
      AutoUser,
      {
        firstName,
        lastName,
        email,
        vaccinated: isVaxxed,
        userId: String(interaction.user.id),
      },
      { userId: String(interaction.user.id) }
    );
    await createOrUpdate<
      AutoDays,
      AutoDaysAttributes,
      AutoDaysCreationAttributes
    >(
      AutoDays,
      { userId: String(interaction.user.id) },
      { userId: String(interaction.user.id) }
    );
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    if (autoUserObj.emailOnly) {
      return await interaction.reply({
        content:
          "Updated! As a reminder, you have email-only screenings on, and to disable that run `/toggle_email_only`.",
        ephemeral,
      });
    }
    await interaction.reply({
      content: "Updated! Check your DMs for the confirmation screening.",
      ephemeral,
    });
    try {
      await interaction.user.send(
        "In order to make sure you entered the correct information, a sample screening will be generated for you. If you find any errors, use `/set_auto` again."
      );
      const user: User = interaction.user;
      await (await user.createDM()).sendTyping();
      await interaction.client.screeningClient.queueAutoCommand(
        interaction.user.id,
        {
          itemType: ItemType.user,
          item: user,
          ephemeral,
        }
      );
      await sendMessage({
        itemType: ItemType.user,
        item: user,
        embeds: interaction.client.guideData.get("post_set_auto")!,
      });
    } catch (e) {
      if (
        e.name === "DiscordAPIError" &&
        e.message === "Cannot send messages to this user"
      ) {
        await interaction.followUp({
          content:
            "I cannot send you a screening, possibly due to DMs being disabled from server members. Therefore, you will be set to email-only screenings. In order to disable email-only mode, please run `/set` after making sure your DMs are open again.",
          embeds: interaction.client.guideData.get("post_set_auto",)!,
          ephemeral
        });
        autoUserObj.emailOnly = true;
        await autoUserObj.save();
      } else {
        throw e;
      }
    }
  }
}
