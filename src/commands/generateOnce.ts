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
import { SlashCommandBuilder } from "@discordjs/builders";
import { ItemType } from "../utils/multiMessage";
import { HSBCommandInteraction } from "../discordjs-overrides";
import screeningTypes, {
  screeningTypeType,
} from "@healthscreening/screening-types";
import getDeviceData from "../screeningClient/getUserInfo/getDeviceData";
import { Command } from "../client/command";

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
        .setDescription("Whether or not you are vaccinated.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of screening to generate.")
        .setRequired(false)
        .addChoices(
          Object.entries(screeningTypes).map(([key, value]) => [value, key])
        )
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
    const type = (interaction.options.getString("type") ||
      "G") as screeningTypeType;
    const deviceData = await getDeviceData({ userId: interaction.user.id });
    await interaction.client.screeningClient.queueOnceCommand(
      interaction.user.id,
      {
        generateScreenshotParams: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          isVaxxed: isVaxxed,
          type: type,
          device: deviceData.device,
        },
        multiMessageParams: {
          itemType: ItemType.interaction,
          item: interaction,
        },
      }
    );
  }
}
