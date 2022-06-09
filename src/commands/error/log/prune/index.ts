import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import {
  AutocompleteInteraction,
  Collection,
  CommandInteraction,
  MessageEmbed,
} from "discord.js";
import { DateTime } from "luxon";
import { Op, col, fn, where } from "sequelize";

import { Subcommand } from "../../../../client/command";
import { ErrorLog } from "../../../../orm/errorLog";
import afterAutocomplete from "../view/autocomplete/after";
import afterTimeAutocomplete from "../view/autocomplete/afterTime";
import beforeAutocomplete from "../view/autocomplete/before";
import beforeTimeAutocomplete from "../view/autocomplete/beforeTime";
import typeStartsWithAutocomplete from "../view/autocomplete/typeStartsWith";

export default class ErrorLogPruneCommand extends Subcommand {
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
          .setName("type_starts_with")
          .setDescription(
            "Prunes the errors with a type starting with the given string"
          )
          .setRequired(false)
          .setAutocomplete(true)
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
          .setDescription("Whether the contents are hidden to everyone else")
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
      whereQuery.type = where(fn("lower", col("type")), {
        [Op.startsWith]: typeStartsWith.toLowerCase(),
      });
    }

    const deleted = await ErrorLog.destroy({
      where: whereQuery,
      limit: limit || undefined,
    });
    const embed = new MessageEmbed();
    embed.setTitle("Pruned Error Log");
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

    embed.addField("Search Properties", fieldData.trim());
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    await interaction.reply({
      embeds: [embed],
      ephemeral,
    });
  }
}
