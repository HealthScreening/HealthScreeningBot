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
import { HSBAutocompleteInteraction, HSBCommandInteraction } from "../discordjs-overrides";
import logError from "../utils/logError";
import serializeInteraction from "../utils/logError/serializeInteraction";
import handleCommandError from "../utils/handleCommandError";
import { ItemType } from "../utils/multiMessage";
import { CommandInteraction } from "discord.js";
import { Subcommand } from "./command";

export type RootCommand =  [string]
export type CommandWithSubcommand = [string, string]
export type CommandWithSubcommandGroup = [string, string, string]
export type PossibleCommandNames = RootCommand | CommandWithSubcommand | CommandWithSubcommandGroup

export async function getTrueCommand(interaction: HSBCommandInteraction | HSBAutocompleteInteraction): Promise<Subcommand | null> {
  const commandParts: PossibleCommandNames = [interaction.commandName, interaction.options.getSubcommandGroup(false), interaction.options.getSubcommand(false)].filter((value) => value !== null) as PossibleCommandNames;
  const root = commandParts[0];
  const remainder = commandParts.slice(1).join(" ");
  const command = interaction.client.commands.get(
    root
  );

  if (!command) {
    await logError(
      new Error(`Command ${interaction.commandName} not found`),
      "interaction::resolveCommand::commandNotFound",
      serializeInteraction(interaction)
    );
    if (interaction instanceof CommandInteraction){
      await handleCommandError(
        { itemType: ItemType.interaction, item: interaction },
        interaction.commandName
      );
    }
    return null;
  }

  if (remainder){
    const subcommand = command.subcommands.get(remainder);
    if (!subcommand) {
      await logError(
        new Error(`Subcommand ${subcommand} not found`),
        "interaction::resolveCommand::subCommandNotFound",
        serializeInteraction(interaction)
      );
      if (interaction instanceof CommandInteraction){
        await handleCommandError(
          { itemType: ItemType.interaction, item: interaction },
          interaction.commandName
        );
      }
      return null;
    } else {
      return subcommand
    }
  } else {
    return command;
  }
}