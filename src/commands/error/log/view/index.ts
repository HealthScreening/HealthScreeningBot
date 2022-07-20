import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  AutocompleteInteraction,
  Collection,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { DateTime } from "luxon";
import { Op, col, fn, literal, where } from "sequelize";

import { Subcommand } from "../../../../client/command";
import { ErrorLog } from "../../../../orm/errorLog";
import { ItemType } from "../../../../utils/multiMessage";
import Paginator from "../../../../utils/paginator";
import afterAutocomplete from "./autocomplete/after";
import afterTimeAutocomplete from "./autocomplete/afterTime";
import beforeAutocomplete from "./autocomplete/before";
import beforeTimeAutocomplete from "./autocomplete/beforeTime";
import typeStartsWithAutocomplete from "./autocomplete/typeStartsWith";

export default class ErrorLogViewCommand extends Subcommand {
  public readonly autocompleteFields: Collection<
    string,
    (interaction: AutocompleteInteraction) => Promise<void>
  > = new Collection(
    Object.entries({
      type_starts_with: typeStartsWithAutocomplete,
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
      .setDescription("View the error log.")
      .addIntegerOption((option) =>
        option
          .setName("before")
          .setDescription("Show the errors before this error #")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("after")
          .setDescription("Show the errors after this error #")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("after_time")
          .setDescription("Show errors after the given UNIX timestamp")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("before_time")
          .setDescription("Show errors before the given UNIX timestamp")
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("desc")
          .setDescription("Show the errors in descending order, default true")
          .setRequired(false)
      )
      .addStringOption((option) =>
        option
          .setName("type_starts_with")
          .setDescription(
            "Shows the errors with a type starting with the given string"
          )
          .setRequired(false)
          .setAutocomplete(true)
      )
      .addIntegerOption((option) =>
        option
          .setName("limit")
          .setDescription("Limit the number of errors shown")
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("unique")
          .setDescription("Display unique errors only (hides duplicates).")
          .setRequired(false)
      )
      .addBooleanOption((option) =>
        option
          .setName("ephemeral")
          .setDescription("Whether the contents are hidden to everyone else")
          .setRequired(false)
      );
  }

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const isDesc = interaction.options.getBoolean("desc", false) ?? true;
    const whereQuery: { [k: string]: object } = {};
    const before: number | null = interaction.options.getInteger("before");
    const after: number | null = interaction.options.getInteger("after");
    const beforeTime: number | null =
      interaction.options.getInteger("before_time");
    const afterTime: number | null =
      interaction.options.getInteger("after_time");
    const typeStartsWith: string | null =
      interaction.options.getString("type_starts_with");
    const limit: number | null = interaction.options.getInteger("limit");
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

    if (typeStartsWith) {
      whereQuery.type = where(fn("lower", col("type")), {
        [Op.startsWith]: typeStartsWith.toLowerCase(),
      });
    }

    let items: ErrorLog[];
    if (unique) {
      items = await ErrorLog.findAll({
        attributes: [
          [literal('(array_agg("id" order by "id" DESC))[1]'), "id"],
          "errorName",
          "errorDescription",
          [
            literal('(array_agg("createdAt" order by "createdAt" DESC))[1]'),
            "createdAt",
          ],
        ],
        where: whereQuery,
        order: [[col("createdAt"), isDesc ? "DESC" : "ASC"]],
        limit: limit || undefined,
        group: unique ? ["type", "errorName", "errorDescription"] : undefined,
      });
    } else {
      items = await ErrorLog.findAll({
        where: whereQuery,
        order: [[col("createdAt"), isDesc ? "DESC" : "ASC"]],
        limit: limit || undefined,
      });
    }

    const embed = new EmbedBuilder();
    embed.setTitle("Error Log");
    let fieldData = `Direction: **${isDesc ? "Descending" : "Ascending"}**`;
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

    if (typeStartsWith) {
      fieldData += `\nType Starts With: **\`${typeStartsWith}\`**`;
    } else {
      fieldData += "\nType Starts With: **None**";
    }

    if (limit) {
      fieldData += `\nLimit: **${limit}**`;
    } else {
      fieldData += "\nLimit: **None**";
    }

    embed.addFields({ name:"Search Properties", value:fieldData });
    const embeds: EmbedBuilder[] = [];
    if (items.length > 0) {
      embed.setColor("Green");
      let baseString = "";
      let currentEmbed = new EmbedBuilder(embed.toJSON());
      items
        .map(
          (item: ErrorLog) =>
            `#${item.id}. ${item.errorName}: ${item.errorDescription}`
        )
        .forEach((item: string) => {
          if (baseString.length + item.length > 4096) {
            currentEmbed.setDescription(baseString.trimEnd());
            embeds.push(currentEmbed);
            currentEmbed = new EmbedBuilder(embed.toJSON());
            baseString = "";
          }

          baseString += `${item}\n`;
        });
      if (baseString) {
        currentEmbed.setDescription(baseString.trimEnd());
        embeds.push(currentEmbed);
      }
    } else {
      embed.setDescription("No errors found.");
      embed.setColor("Red");
      embeds.push(embed);
    }

    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await new Paginator(embeds).send({
      itemType: ItemType.interaction,
      item: interaction,
      ephemeral,
    });
  }
}
