import { Op, cast, col, where } from "sequelize";

import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { ErrorLog } from "../../../../../orm/errorLog";

export default async function beforeAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const response = interaction.options.getFocused(false) as unknown as number;
  const after: number | null = interaction.options.getInteger("after");
  const beforeTime: number | null =
    interaction.options.getInteger("before_time");
  const afterTime: number | null = interaction.options.getInteger("after_time");
  const typeStartsWith: string | null =
    interaction.options.getString("type_starts_with");
  const whereQuery: { [k: string]: object } = {
    [Op.and]: [
      where(cast(col("id"), "text"), {
        [Op.startsWith]: String(response),
      }),
    ],
  };
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

  await interaction.respond(
    (
      await ErrorLog.findAll({
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
