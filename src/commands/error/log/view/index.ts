import {
  AutocompleteInteraction,
  Collection,
  CommandInteraction,
  MessageEmbed,
} from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";
import { ErrorLog } from "../../../../orm/errorLog";
import Paginator from "../../../../utils/paginator";
import { ItemType } from "../../../../utils/multiMessage";
import { Subcommand } from "../../../../client/command";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import typeStartsWithAutocomplete from "./autocomplete/typeStartsWith";
import beforeAutocomplete from "./autocomplete/before";
import afterAutocomplete from "./autocomplete/after";
import afterTimeAutocomplete from "./autocomplete/afterTime";
import beforeTimeAutocomplete from "./autocomplete/beforeTime";

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
      );
  }
  async execute(interaction: CommandInteraction) {
    const isDesc = interaction.options.getBoolean("desc", false) || true;
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
      if (!whereQuery.type) {
        whereQuery.type = {};
      }
      whereQuery.type[Op.startsWith] = typeStartsWith;
    }
    const items: ErrorLog[] = await ErrorLog.findAll({
      where: whereQuery,
      order: [["createdAt", isDesc ? "DESC" : "ASC"]],
      limit: limit || undefined,
    });
    const embed = new MessageEmbed();
    embed.setTitle("Error Log");
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
    if (typeStartsWith) {
      fieldData += `\nType Starts With: **\`${typeStartsWith}\`**`;
    } else {
      fieldData += "\nType Starts With: **None**";
    }
    embed.addField("Search Properties", fieldData);
    const embeds: MessageEmbed[] = [];
    if (items) {
      embed.setColor("GREEN");
      let baseString = "";
      let currentEmbed = new MessageEmbed(embed);
      items
        .map((item: ErrorLog) => {
          return `#${item.id}. ${item.errorName}: ${item.errorDescription}`;
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
      embed.setDescription("No errors found.");
      embed.setColor("RED");
      embeds.push(embed);
    }
    await new Paginator(embeds).send({
      itemType: ItemType.interaction,
      item: interaction,
    });
    return;
  }
}
