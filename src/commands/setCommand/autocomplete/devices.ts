/**
 * Copyright (C) 2021-2022 PythonCoderAS
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
import { devices } from "puppeteer";

import { HSBAutocompleteInteraction } from "../../../discordjs-overrides";

export default async function devicesAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const input = interaction.options.getFocused(false) as string;
  let deviceNames = Object.values(devices)
    .map((device) => device.name)
    .filter(
      (name) =>
        name.toLowerCase().startsWith(input.toLowerCase()) &&
        !name.endsWith("landscape")
    );
  if (deviceNames.length > 25) {
    deviceNames = deviceNames.slice(0, 25);
  } else if (deviceNames.length <= 24 && deviceNames.includes(input)) {
    deviceNames.splice(1, 0, input + " landscape");
  }
  await interaction.respond(
    deviceNames.map((value) => {
      return {
        name: value,
        value,
      };
    })
  );
}
