/**
 * Copyright (C) 2021-2022 PythonCoderAS
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
import { Op, col, fn, literal, where } from "sequelize";

import { Subcommand } from "../../../../client/command";
import { CommandLog } from "../../../../orm/commandLog";
import { ItemType } from "../../../../utils/multiMessage";
import Paginator from "../../../../utils/paginator";
import afterAutocomplete from "./autocomplete/after";
import afterTimeAutocomplete from "./autocomplete/afterTime";
import beforeAutocomplete from "./autocomplete/before";
import beforeTimeAutocomplete from "./autocomplete/beforeTime";
import commandNameStartsWithAutocomplete from "./autocomplete/commandNameStartsWith";

export default class CommandLogViewCommand extends Subcommand {
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
      .setName("view")
      .setDescription("View the command log.")
      .addIntegerOption((option) =>
        option
          .setName("before")
          .setDescription("Show the commands before this command #")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("after")
          .setDescription("Show the commands after this command #")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("after_time")
          .setDescription("Show commands after the given UNIX timestamp")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("before_time")
          .setDescription("Show commands before the given UNIX timestamp")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("desc")
          .setDescription("Show the commands in descending order, default true")
          .setRequired(false)
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
          .setDescription("Limit the number of commands shown")
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("paginate")
          .setDescription("Enable pagination.")
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("unique")
          .setDescription("Display unique commands only (hides duplicates).")
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("ephemeral")
          .setDescription("Whether the contents are hidden to everyone else")
          .setRequired(false)
      );
  }
  async execute(interaction: CommandInteraction) {
    const isDesc = interaction.options.getBoolean("desc", false) ?? true;
    const whereQuery: { [k: string]: object } = {};
    const before: number | null = interaction.options.getInteger("before");
    const after: number | null = interaction.options.getInteger("after");
    const beforeTime: number | null =
      interaction.options.getInteger("before_time");
    const afterTime: number | null =
      interaction.options.getInteger("after_time");
    const commandNameStartsWith: string | null = interaction.options.getString(
      "command_name_starts_with"
    );
    const limit: number | null = interaction.options.getInteger("limit");
    const userId: User | null = interaction.options.getUser("user_id");
    const unique: boolean =
      interaction.options.getBoolean("unique", false) ?? false;
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
    let items: CommandLog[];
    if (unique) {
      items = await CommandLog.findAll({
        attributes: [
          [literal('(array_agg("id" order by "id" DESC))[1]'), "id"],
          "commandName",
          "userName",
          [
            literal('(array_agg("createdAt" order by "createdAt" DESC))[1]'),
            "createdAt",
          ],
        ],
        where: whereQuery,
        order: [[col("createdAt"), isDesc ? "DESC" : "ASC"]],
        limit: limit || undefined,
        group: unique ? ["commandName", "commandName", "userName"] : undefined,
      });
    } else {
      items = await CommandLog.findAll({
        where: whereQuery,
        order: [[col("createdAt"), isDesc ? "DESC" : "ASC"]],
        limit: limit || undefined,
      });
    }
    const embed = new MessageEmbed();
    embed.setTitle("Command Log");
    let fieldData: string =
      "Direction: **" + (isDesc ? "Descending" : "Ascending") + "**";
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
    if (userId) {
      fieldData += `\nUser ID: **${userId.id}**`;
    } else {
      fieldData += "\nUser ID: **None**";
    }
    if (limit) {
      fieldData += `\nLimit: **${limit}**`;
    } else {
      fieldData += "\nLimit: **None**";
    }
    embed.addField("Search Properties", fieldData);
    const embeds: MessageEmbed[] = [];
    if (items.length > 0) {
      embed.setColor("GREEN");
      let baseString = "";
      let currentEmbed = new MessageEmbed(embed);
      items
        .map((item: CommandLog) => {
          return `#${item.id}. ${item.userName} (<@${item.userId}>) ran ${item.commandName}`;
        })
        .forEach((item: string) => {
          if (baseString.length + item.length > 4096) {
            currentEmbed.setDescription(baseString.trimEnd());
            embeds.push(currentEmbed);
            currentEmbed = new MessageEmbed(embed);
            baseString = "";
          }
          baseString += item + "\n";
        });
      if (baseString) {
        currentEmbed.setDescription(baseString.trimEnd());
        embeds.push(currentEmbed);
      }
    } else {
      embed.setDescription("No commands found.");
      embed.setColor("RED");
      embeds.push(embed);
    }
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    const paginate = interaction.options.getBoolean("paginate", false) ?? true;
    if (paginate) {
      await new Paginator(embeds).send({
        itemType: ItemType.interaction,
        item: interaction,
        ephemeral,
      });
    } else {
      if (embeds.length > 10) {
        return await interaction.reply({
          content: "Too many embeds to display. Please use the paginator.",
          ephemeral: true,
        });
      }
      await interaction.reply({
        embeds,
        ephemeral,
      });
    }
  }
}
