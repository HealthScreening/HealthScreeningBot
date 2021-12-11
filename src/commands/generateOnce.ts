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

module.exports = {
  data: new SlashCommandBuilder()
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
    ),
  async execute(interaction: HSBCommandInteraction) {
    const firstName = interaction.options.getString("first_name");
    const lastName = interaction.options.getString("last_name");
    const email = interaction.options.getString("email");
    if (
      !email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)
    ) {
      return await interaction.reply(
        "Invalid email! Please enter a valid email."
      );
    }
    const isVaxxed = interaction.options.getBoolean("vaccinated");
    await interaction.client.screeningClient.queueOnceCommand(
      interaction.user.id,
      {
        generateScreenshotParams: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          isVaxxed: isVaxxed,
        },
        multiMessageParams: {
          itemType: ItemType.interaction,
          item: interaction,
        },
      }
    );
  },
};
