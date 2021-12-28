/**
 * Copyright (C) 2021 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { DateTime } from "luxon";
import { Op } from "sequelize";

import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { ErrorLog } from "../../../../../orm/errorLog";

export default async function afterTimeAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const response = interaction.options.getFocused(false) as number;
  const before: number | null = interaction.options.getInteger("before");
  const after: number | null = interaction.options.getInteger("after");
  const beforeTime: number | null =
    interaction.options.getInteger("before_time");
  const typeStartsWith: string | null =
    interaction.options.getString("type_starts_with");
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
  if (typeStartsWith) {
    if (!whereQuery.type) {
      whereQuery.type = {};
    }
    whereQuery.type[Op.startsWith] = typeStartsWith;
  }
  await interaction.respond(
    (
      await ErrorLog.findAll({
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
        value: value,
      };
    })
  );
}
