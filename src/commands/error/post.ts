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
import { Op } from "sequelize";
import { ErrorLog } from "../../orm/errorLog";
import { HSBCommandInteraction } from "../../discordjs-overrides";
import formatErrorLogEntry from "../../utils/formatErrorLogEntry";
import { Subcommand } from "../../client/command";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

export default class ErrorPostCommand extends Subcommand {
  registerSubcommand(
    subcommand: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder {
    return subcommand
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
      .addBooleanOption((option) =>
        option
          .setName("ephemeral")
          .setDescription(
            "Whether or not the contents are hidden to everyone else"
          )
          .setRequired(false)
      );
  }
  async execute(interaction: HSBCommandInteraction) {
    const id: number = interaction.options.getInteger("id", true);
    const redact: boolean =
      interaction.options.getBoolean("redact", false) ?? false;
    const item: ErrorLog | null = await ErrorLog.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    if (!item) {
      return await interaction.reply("No error with that ID found.");
    }
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.reply({ content: "Posting to GitHub...", ephemeral });
    await interaction.client.githubQueue.enqueue(
      [
        `[${item.type}] ${item.errorName}: ${item.errorDescription}`.substring(
          0,
          256
        ),
        formatErrorLogEntry(item, redact),
      ],
      0
    );
  }
}
