import { Op } from "sequelize";
import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { ErrorLog } from "../../../../../orm/errorLog";

export default async function typeStartsWithAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const response = interaction.options.getFocused(false) as string;
  const before: number | null = interaction.options.getInteger("before");
  const after: number | null = interaction.options.getInteger("after");
  const beforeTime: number | null =
    interaction.options.getInteger("before_time");
  const afterTime: number | null = interaction.options.getInteger("after_time");
  const whereQuery: { [k: string]: object } = {
    type: {
      [Op.startsWith]: response as string,
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
  if (afterTime) {
    if (!whereQuery.createdAt) {
      whereQuery.createdAt = {};
    }
    whereQuery.createdAt[Op.gt] = new Date(afterTime * 1000);
  }

  await interaction.respond(
    (
      await ErrorLog.findAll({
        attributes: ["type"],
        where: whereQuery,
        limit: 25,
        group: ["type"],
        order: [["type", "ASC"]],
      })
    ).map((item) => {
      return {
        name: item.type,
        value: item.type,
      };
    })
  );
}
