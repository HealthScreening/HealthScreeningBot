import { Op, cast, col, where } from "sequelize";

import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { CommandLog } from "../../../../../orm/commandLog";

export default async function afterAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const response = interaction.options.getFocused(false) as unknown as number;
  const before: number | null = interaction.options.getInteger("before");
  const beforeTime: number | null =
    interaction.options.getInteger("before_time");
  const afterTime: number | null = interaction.options.getInteger("after_time");
  const commandNameStartsWith: string | null = interaction.options.getString(
    "command_name_starts_with"
  );
  const userId: string | null =
    interaction.options.get("user_id")?.value?.toString() ?? null;
  const whereQuery: { [k: string]: object } = {
    [Op.and]: [
      where(cast(col("id"), "text"), {
        [Op.startsWith]: String(response),
      }),
    ],
  };
  if (before) {
    if (!whereQuery.id) {
      whereQuery.id = {};
    }

    whereQuery.id[Op.lt] = before;
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
        attributes: ["id"],
        where: whereQuery,
        limit: 25,
        order: [["id", "ASC"]],
      })
    ).map((item) => ({
      name: item.id.toString(),
      value: item.id,
    }))
  );
}
