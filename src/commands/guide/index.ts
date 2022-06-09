import { SlashCommandBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, Collection } from "discord.js";

import { Command } from "../../client/command";
import { HSBCommandInteraction } from "../../discordjs-overrides";
import { ItemType } from "../../utils/multiMessage";
import Paginator from "../../utils/paginator";
import nameAutocomplete from "./autocomplete/name";
import sendQuickstart from "./custom/sendQuickstart";

export const customGuides: Collection<
  string,
  (interaction: HSBCommandInteraction) => Promise<void>
> = new Collection(
  Object.entries({
    quickstart: (interaction) =>
      sendQuickstart(interaction.client, {
        itemType: ItemType.interaction,
        item: interaction,
      }),
  })
);

export default class Guide extends Command {
  public autocompleteFields: Collection<
    string,
    (interaction: AutocompleteInteraction) => Promise<void>
  > = new Collection(
    Object.entries({
      name: nameAutocomplete,
    })
  );

  public readonly data = new SlashCommandBuilder()
    .setName("guide")
    .setDescription("Sends a possible guide.")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the guide to send")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Whether the contents are hidden to everyone else.")
        .setRequired(false)
    ) as SlashCommandBuilder;

  async execute(interaction: HSBCommandInteraction): Promise<void> {
    const name = interaction.options.getString("name", true);
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? false;
    if (!interaction.client.guideData.has(name)) {
      await interaction.reply({
        content: "The guide you requested does not exist. Please try again.",
        ephemeral: true,
      });
      return;
    }

    if (customGuides.has(name)) {
      await customGuides.get(name)!(interaction);
      return;
    }

    const guide = interaction.client.guideData.get(name)!;
    await new Paginator(guide).send({
      itemType: ItemType.interaction,
      item: interaction,
      ephemeral,
    });
  }
}
