import { User } from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";

import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { CommandLog } from "../../../../../orm/commandLog";

export default async function beforeTimeAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const response = interaction.options.getFocused(false) as unknown as number;
  const before: number | null = interaction.options.getInteger("before");
  const after: number | null = interaction.options.getInteger("after");
  const afterTime: number | null =
    interaction.options.getInteger("before_time");
  const commandNameStartsWith: string | null = interaction.options.getString(
    "command_name_starts_with"
  );
  const userId: string | null = interaction.options.get("user_id")?.value?.toString() ?? null;
  const whereQuery: { [k: string]: object } = {
    createdAt: {
      [Op.lt]: new Date(response * 1000),
    },
  };
  if (before) {
    if (!whereQuery.id) {
      whereQuery.id = {};
    }

    whereQuery.id[Op.gt] = before;
  }

  if (after) {
    if (!whereQuery.id) {
      whereQuery.id = {};
    }

    whereQuery.id[Op.lt] = after;
  }

  if (afterTime) {
    if (!whereQuery.createdAt) {
      whereQuery.createdAt = {};
    }

    whereQuery.createdAt[Op.gt] = new Date(afterTime * 1000);
  }

  if (commandNameStartsWith) {
    if (!whereQuery.commandName) {
      whereQuery.commandName = {};
    }

    whereQuery.commandName[Op.startsWith] = commandNameStartsWith;
  }

  if (userId) {
    if (!whereQuery.userId) {
      whereQuery.userId = {};
    }

    whereQuery.userId[Op.eq] = userId;
  }

  await interaction.respond(
    (
      await CommandLog.findAll({
        attributes: ["createdAt"],
        where: whereQuery,
        limit: 25,
        order: [["createdAt", "ASC"]],
      })
    ).map((item) => {
      const dt = DateTime.fromMillis(item.createdAt.getTime());
      const value = Math.round(dt.toSeconds()) - 1;
      return {
        name: String(value),
        value,
      };
    })
  );
}
