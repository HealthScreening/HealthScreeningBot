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
import { BaseCommand, PreCommandChecks } from "./command";

export class CommandData {
  public readonly resolved: BaseCommand
  public readonly parts: PreCommandChecks[]
  public readonly names: string[]
  public constructor(resolved: BaseCommand, parts: PreCommandChecks[], names: string[]) {
    this.resolved = resolved
    this.parts = parts
    this.names = names
  }
  public get fullName(): string {
    return this.names.join(" ")
  }
}


/**
 * Gets the actual command object to execute/autocomplete against.
 * @param interaction The interaction to resolve against.
 * @returns The command object to execute/autocomplete against as well as an
 * array of all of the command/subcommand/subcommand groups involved.
 * This is useful for the executor to run the before* checks.
 */
export async function getTrueCommand(interaction: HSBCommandInteraction | HSBAutocompleteInteraction): Promise<CommandData | null> {
  const baseCommand = interaction.commandName
  const subcommandGroup = interaction.options.getSubcommandGroup(false)
  const subcommand = interaction.options.getSubcommand(false)
  const command = interaction.client.commands.get(
    baseCommand
  );

  if (!command) {
    await logError(
      new Error(`Command ${interaction.commandName} not found`),
      "interaction::resolveCommand::commandNotFound",
      serializeInteraction(interaction)
    );
    if (interaction instanceof CommandInteraction) {
      await handleCommandError(
        { itemType: ItemType.interaction, item: interaction },
        interaction.commandName
      );
    }
    return null;
  }

  if (subcommandGroup) {
    const foundSubcommandGroup = command.subcommandGroups.get(subcommandGroup);
    if (!foundSubcommandGroup) {
      await logError(
        new Error(`Subcommand group ${subcommandGroup} not found for command ${baseCommand}`),
        "interaction::resolveCommand::subCommandGroupNotFound",
        serializeInteraction(interaction)
      );
      if (interaction instanceof CommandInteraction) {
        await handleCommandError(
          { itemType: ItemType.interaction, item: interaction },
          interaction.commandName
        );
      }
      return null;
    }
    else {
      // If subcommand group exists, subcommand exists
      const foundSubcommand = foundSubcommandGroup.subcommands.get(subcommand!);
      if (!foundSubcommand){
        await logError(
          new Error(`Subcommand ${subcommand} not found for command ${baseCommand} in subcommand group ${subcommandGroup}`),
          "interaction::resolveCommand::subCommandNotFound",
          serializeInteraction(interaction)
        );
        if (interaction instanceof CommandInteraction) {
          await handleCommandError(
            { itemType: ItemType.interaction, item: interaction },
            interaction.commandName
          );
        }
        return null;
      } else {
        return new CommandData(foundSubcommand, [command, foundSubcommandGroup, foundSubcommand], [baseCommand, subcommandGroup, subcommand!]);
      }
    }
  } else if (subcommand) {
    const foundSubcommand = command.subcommands.get(subcommand);
    if (!foundSubcommand) {
      await logError(
        new Error(`Subcommand ${subcommand} not found for command ${baseCommand}`),
        "interaction::resolveCommand::subCommandNotFound",
        serializeInteraction(interaction)
      );
      if (interaction instanceof CommandInteraction) {
        await handleCommandError(
          { itemType: ItemType.interaction, item: interaction },
          interaction.commandName
        );
      }
      return null;
    }
    else {
      return new CommandData(foundSubcommand, [command, foundSubcommand], [baseCommand, subcommand]);
    }
  }
  else {
    return new CommandData(command, [command], [baseCommand]);
  }
}