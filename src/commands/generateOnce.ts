import { SlashCommandBuilder } from "@discordjs/builders";

import screeningTypes, {
  screeningTypeType,
} from "@healthscreening/screening-types";

import { Command } from "../client/command";
import { HSBCommandInteraction } from "../discordjs-overrides";
import getDeviceData from "../screeningClient/getUserInfo/getDeviceData";
import { ItemType } from "../utils/multiMessage";

export default class GenerateOnce extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("generate_once")
    .setDescription("Generate a singular health screening")
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
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of screening to generate.")
        .setRequired(false)
        .addChoices(
          ...Object.entries(screeningTypes).map(([key, value]) => ({
            value,
            name: key,
          }))
        )
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
      return interaction.reply({
        content: "Invalid email! Please enter a valid email.",
        ephemeral: true,
      });
    }

    const isVaxxed = interaction.options.getBoolean("vaccinated")!;
    const type = (interaction.options.getString("type") ||
      "G") as screeningTypeType;
    const deviceData = await getDeviceData({ userId: interaction.user.id });
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.client.screeningClient.queueOnceCommand(
      interaction.user.id,
      {
        generateScreenshotParams: {
          firstName,
          lastName,
          email,
          isVaxxed,
          type,
          device: deviceData.device,
        },
        multiMessageParams: {
          itemType: ItemType.interaction,
          item: interaction,
          ephemeral,
        },
      }
    );
  }
}
