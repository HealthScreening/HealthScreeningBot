import { DateTime } from "luxon";
import { Op } from "sequelize";
import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { ErrorLog } from "../../../../../orm/errorLog";

export default async function beforeTimeAutocomplete(interaction: HSBAutocompleteInteraction) {
  const response = interaction.options.getFocused(false) as number;
  const before: number | null = interaction.options.getInteger("before");
  const after: number | null = interaction.options.getInteger("after");
  const afterTime: number | null =
    interaction.options.getInteger("before_time");
  const typeStartsWith: string | null =
    interaction.options.getString("type_starts_with");
  const whereQuery: { [k: string]: object } = {
    createdAt: {
      [Op.lt]: new Date(response * 1000)
    }
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
  if (typeStartsWith) {
    if (!whereQuery.type) {
      whereQuery.type = {};
    }
    whereQuery.type[Op.startsWith] = typeStartsWith;
  }
  await interaction.respond((await ErrorLog.findAll({
    attributes: ["createdAt"],
    where: whereQuery,
    limit: 25,
    order: [["createdAt", "ASC"]]
  })).map((item) => {
    const dt = DateTime.fromMillis(item.createdAt.getTime())
    const value = Math.round(dt.toSeconds()) - 1
    return {
      name: String(value),
      value: value
    };
  }));
}