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
import { CommandInteraction } from "discord.js";
import runSubcommands from "../utils/runSubcommands";
import checkOwner from "../utils/checkOwner";
import { ItemType } from "../utils/multiMessage";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("error")
    .setDescription("Interact with the bot's error log.")
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("log")
        .setDescription("Interact with multiple errors from the error log")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("view")
            .setDescription("View the error log.")
            .addIntegerOption((option) =>
              option
                .setName("before")
                .setDescription("Show the errors before this error #")
                .setRequired(false)
            )
            .addIntegerOption((option) =>
              option
                .setName("after")
                .setDescription("Show the errors after this error #")
                .setRequired(false)
            )
            .addIntegerOption((option) =>
              option
                .setName("after_time")
                .setDescription("Show errors after the given UNIX timestamp")
                .setRequired(false)
            )
            .addIntegerOption((option) =>
              option
                .setName("before_time")
                .setDescription("Show errors before the given UNIX timestamp")
                .setRequired(false)
            )
            .addBooleanOption((option) =>
              option
                .setName("desc")
                .setDescription(
                  "Show the errors in descending order, default true"
                )
                .setRequired(false)
            )
            .addStringOption((option) =>
              option
                .setName("type_starts_with")
                .setDescription(
                  "Shows the errors with a type starting with the given string"
                )
                .setRequired(false)
            )
            .addIntegerOption((option) =>
              option
                .setName("limit")
                .setDescription("Limit the number of errors shown")
                .setRequired(false)
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View an individual error")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the error to view.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("post")
        .setDescription("Post an individual error to GitHub")
        .addIntegerOption((option) =>
          option
            .setName("id")
            .setDescription("The ID of the error to post.")
            .setRequired(true)
        )
        .addBooleanOption((option) =>
          option
            .setName("redact")
            .setDescription("Whether or not to redact the metadata.")
            .setRequired(false)
        )
    ),
  async execute(interaction: CommandInteraction) {
    if (
      !(await checkOwner({ itemType: ItemType.interaction, item: interaction }))
    ) {
      return;
    }
    return await runSubcommands(this, interaction);
  },
};
