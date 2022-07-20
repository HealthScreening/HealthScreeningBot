import { User } from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";

import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { CommandLog } from "../../../../../orm/commandLog";

export default async function afterTimeAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const response = interaction.options.getFocused(false) as unknown as number;
  const before: number | null = interaction.options.getInteger("before");
  const after: number | null = interaction.options.getInteger("after");
  const beforeTime: number | null =
    interaction.options.getInteger("before_time");
  const commandNameStartsWith: string | null = interaction.options.getString(
    "command_name_starts_with"
  );
  const userId: string | null = interaction.options.get("user_id")?.value?.toString() ?? null;
  const whereQuery: { [k: string]: object } = {
    createdAt: {
      [Op.gt]: response,
    },
  };
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
