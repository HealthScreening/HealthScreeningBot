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
import { HSBCommandInteraction } from "../discordjs-overrides";
import { ItemType } from "../utils/multiMessage";
import { User } from "discord.js";
import { AutoUser } from "../orm/autoUser";

function createOrDelete(values, condition) {
  return AutoUser.findOne({ where: condition }).then(function (obj) {
    // update
    if (obj) return obj.update(values);
    // insert
    return AutoUser.create(values);
  });
}

module.exports = {
  data: new SlashCommandBuilder()
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
        .setDescription("Whether or not you are vaccinated.")
        .setRequired(true)
    ),
  async execute(interaction: HSBCommandInteraction) {
    const firstName = interaction.options.getString("first_name")!;
    const lastName = interaction.options.getString("last_name")!;
    const email = interaction.options.getString("email")!;
    if (
      !email.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)
    ) {
      return await interaction.reply(
        "Invalid email! Please enter a valid email."
      );
    }
    const isVaxxed = interaction.options.getBoolean("vaccinated")!;
    await createOrDelete(
      {
        firstName,
        lastName,
        email,
        isVaxxed,
        userId: String(interaction.user.id),
      },
      { userId: String(interaction.user.id) }
    );
    await interaction.reply(
      "Updated! Check your DMs for the confirmation screening."
    );
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
      }
    );
  },
};
