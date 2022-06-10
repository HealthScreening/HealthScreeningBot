import { User } from "discord.js";
import { Op, col, fn, where } from "sequelize";

import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { CommandLog } from "../../../../../orm/commandLog";

export default async function commandNameStartsWithAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const response = interaction.options.getFocused(false) as string;
  const before: number | null = interaction.options.getInteger("before");
  const after: number | null = interaction.options.getInteger("after");
  const beforeTime: number | null =
    interaction.options.getInteger("before_time");
  const afterTime: number | null = interaction.options.getInteger("after_time");
  const userId: User | null = interaction.options.getUser("user_id");
  const whereQuery: { [k: string]: object } = {
    commandName: where(fn("lower", col("commandName")), {
      [Op.startsWith]: (response as string).toLowerCase(),
    }),
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

  if (afterTime) {
    if (!whereQuery.createdAt) {
      whereQuery.createdAt = {};
    }

    whereQuery.createdAt[Op.gt] = new Date(afterTime * 1000);
  }

  if (userId) {
    if (!whereQuery.userId) {
      whereQuery.userId = {};
    }

    whereQuery.userId[Op.eq] = userId.id;
  }

  await interaction.respond(
    (
      await CommandLog.findAll({
        attributes: ["commandName"],
        where: whereQuery,
        limit: 25,
        group: ["commandName"],
        order: [["commandName", "ASC"]],
      })
    ).map((item) => ({
      name: item.commandName,
      value: item.commandName,
    }))
  );
}
