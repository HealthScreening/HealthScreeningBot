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
import {
  AutocompleteInteraction,
  CommandInteraction,
  CommandInteractionOption,
} from "discord.js";

export default function serializeInteraction(
  interaction: CommandInteraction | AutocompleteInteraction
): object {
  return {
    command: {
      base: interaction.commandName,
      subcommandGroup: interaction.options.getSubcommandGroup(false),
      subcommand: interaction.options.getSubcommand(false),
    },
    arguments: interaction.options.data.map(
      (item: CommandInteractionOption) => {
        let value;
        switch (item.type) {
          case "USER":
            value = item.user!.id;
            break;
          case "CHANNEL":
            value = item.channel!.id;
            break;
          case "ROLE":
            value = item.role!.id;
            break;
          case "MENTIONABLE":
            value = (item.user || item.role || item.channel)!.id;
            break;
          default:
            value = item.value;
            break;
        }
        return {
          name: item.name,
          type: item.type,
          value,
          focused: item.focused,
          autocomplete: item.autocomplete,
        };
      }
    ),
    user: interaction.user.id,
    channel: interaction.channel?.id || null,
    guild: interaction.guild?.id || null,
  };
}
