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
import { HSBAutocompleteInteraction } from "../../discordjs-overrides";
import logError from "../../utils/logError";
import serializeInteraction from "../../utils/logError/serializeInteraction";
import { getTrueCommand } from "../resolve";

export default async function commandInteractionAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  try {
    const command = await getTrueCommand(interaction);
    if (!command) {
      return;
    }

    const autocompleteField = interaction.options.getFocused(true).name;

    const toRun = command.parts.filter((item) => item.beforeAutocomplete);
    for (const checkToRun of toRun) {
      if (!(await checkToRun.beforeAutocomplete!(interaction))) {
        return await interaction.respond([]);
      }
    }

    if (!command.resolved.autocompleteFields.has(autocompleteField)) {
      await logError(
        new Error(
          `Command ${command.fullName} does not support autocomplete for field ${autocompleteField}`
        ),
        "interaction::commandInteractionAutocomplete::commandDoesNotSupportAutocomplete",
        {
          interaction: serializeInteraction(interaction),
          supportedAutocompleteFields: Array.from(
            command.resolved.autocompleteFields.keys()
          ),
        }
      );
      return await interaction.respond([]);
    } else {
      try {
        // We confirmed earlier if it exists
        await command.resolved.autocompleteFields.get(autocompleteField)!(
          interaction
        );
      } catch (error) {
        await logError(
          error,
          "interaction::commandInteractionAutocomplete",
          serializeInteraction(interaction)
        );
        return await interaction.respond([]);
      }
    }
  } catch (e) {
    await logError(
      e,
      "interaction::commandInteractionAutocomplete::processing",
      serializeInteraction(interaction)
    );
  }
}
