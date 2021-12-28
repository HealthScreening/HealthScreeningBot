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
import { sortedUniq } from "lodash";

import { HSBAutocompleteInteraction } from "../../../discordjs-overrides";

export default async function minuteAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const options: number[] = [];
  const value = interaction.options.getFocused(false) as number;
  for (let i = value; i <= value + 5; i++) {
    options.push(i);
  }
  for (let i = Math.ceil(value / 5) * 5; i < 60; i += 5) {
    options.push(i);
  }
  if (options.length <= 20) {
    for (let i = value - 1; i >= value - 5 && i >= 0; i--) {
      options.push(i);
    }
  }
  await interaction.respond(
    sortedUniq(options.sort((a, b) => a - b)).map((num) => {
      return {
        name: num.toString(),
        value: num,
      };
    })
  );
}
