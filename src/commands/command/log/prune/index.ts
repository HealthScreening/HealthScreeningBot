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
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  AutocompleteInteraction,
  Collection,
  CommandInteraction,
  MessageEmbed,
  User,
} from "discord.js";
import { DateTime } from "luxon";
import { Op, col, fn, where } from "sequelize";

import { Subcommand } from "../../../../client/command";
import { CommandLog } from "../../../../orm/commandLog";
import afterAutocomplete from "../view/autocomplete/after";
import afterTimeAutocomplete from "../view/autocomplete/afterTime";
import beforeAutocomplete from "../view/autocomplete/before";
import beforeTimeAutocomplete from "../view/autocomplete/beforeTime";
import commandNameStartsWithAutocomplete from "../view/autocomplete/commandNameStartsWith";

export default class CommandLogPruneCommand extends Subcommand {
  public readonly autocompleteFields: Collection<
    string,
    (interaction: AutocompleteInteraction) => Promise<void>
  > = new Collection(
    Object.entries({
      command_name_starts_with: commandNameStartsWithAutocomplete,
      before: beforeAutocomplete,
      after: afterAutocomplete,
      after_time: afterTimeAutocomplete,
      before_time: beforeTimeAutocomplete,
    })
  );
  registerSubcommand(
    subcommand: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder {
    return subcommand
      .setName("prune")
      .setDescription("Prune the error log.")
      .addIntegerOption((option) =>
        option
          .setName("before")
          .setDescription("Prune the errors before this error #")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("after")
          .setDescription("Prune the errors after this error #")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("after_time")
          .setDescription("Prune errors after the given UNIX timestamp")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("before_time")
          .setDescription("Prune errors before the given UNIX timestamp")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addStringOption((option) =>
        option
          .setName("command_name_starts_with")
          .setDescription(
            "Shows the commands with a name starting with the given string"
          )
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addUserOption((option) =>
        option
          .setName("user_id")
          .setDescription("Shows the commands by the given user")
          .setRequired(false)
      )
      .addIntegerOption((option) =>
        option
          .setName("limit")
          .setDescription("Limit the number of errors pruned")
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
  async execute(interaction: CommandInteraction) {
    const whereQuery: { [k: string]: object } = {};
    const before: number | null = interaction.options.getInteger("before");
    const after: number | null = interaction.options.getInteger("after");
    const beforeTime: number | null =
      interaction.options.getInteger("before_time");
    const afterTime: number | null =
      interaction.options.getInteger("after_time");
    const commandNameStartsWith: string | null =
      interaction.options.getString("command_name_starts_with");
    const limit: number | null = interaction.options.getInteger("limit");
    const userId: User | null = interaction.options.getUser("user_id");
    if (before) {
      if (!whereQuery.id) {
        whereQuery.id = {};
      }
      whereQuery.id[Op.lt] = before;
    }
    if (after) {
      if (!whereQuery.id) {
        whereQuery.id = {};
      }
      whereQuery.id[Op.gt] = after;
    }
    if (beforeTime) {
      if (!whereQuery.createdAt) {
        whereQuery.createdAt = {};
      }
      whereQuery.createdAt[Op.lt] = new Date(beforeTime * 1000);
    }
    if (afterTime) {
      if (!whereQuery.createdAt) {
        whereQuery.createdAt = {};
      }
      whereQuery.createdAt[Op.gt] = new Date(afterTime * 1000);
    }
    if (commandNameStartsWith) {
      whereQuery.commandName = where(fn("lower", col("commandName")), {
        [Op.startsWith]: commandNameStartsWith.toLowerCase(),
      });
    }
    if (userId) {
      if (!whereQuery.userId) {
        whereQuery.userId = {};
      }
      whereQuery.userId[Op.eq] = userId.id;
    }
    const deleted = await CommandLog.destroy({
      where: whereQuery,
      limit: limit || undefined,
    });
    const embed = new MessageEmbed();
    embed.setTitle("Pruned Command Log");
    embed.setDescription(`Items Deleted: **${deleted}**`);
    embed.setColor(deleted > 0 ? "GREEN" : "RED");
    let fieldData = "";
    if (before) {
      fieldData += `\nBefore: **#${before}**`;
    } else {
      fieldData += "\nBefore: **None**";
    }
    if (after) {
      fieldData += `\nAfter: **#${after}**`;
    } else {
      fieldData += "\nAfter: **None**";
    }
    if (beforeTime) {
      fieldData += `\nBefore Time: **${DateTime.fromMillis(
        beforeTime * 1000
      ).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**`;
    } else {
      fieldData += "\nBefore Time: **None**";
    }
    if (afterTime) {
      fieldData += `\nAfter Time: **${DateTime.fromMillis(
        afterTime * 1000
      ).toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**`;
    } else {
      fieldData += "\nAfter Time: **None**";
    }
    if (commandNameStartsWith) {
      fieldData += `\nCommand Name Starts With: **\`${commandNameStartsWith}\`**`;
    } else {
      fieldData += "\nType Starts With: **None**";
    }
    if (userId){
      fieldData += `\nUser ID: **${userId.id}**`;
    } else {
      fieldData += "\nUser ID: **None**";
    }
    if (limit) {
      fieldData += `\nLimit: **${limit}**`;
    } else {
      fieldData += "\nLimit: **None**";
    }
    embed.addField("Search Properties", fieldData.trim());
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.reply({
      embeds: [embed],
      ephemeral,
    });
  }
}
