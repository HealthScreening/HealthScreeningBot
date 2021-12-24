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
import { SlashCommandBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, Collection, CommandInteraction, Interaction } from "discord.js";

export interface InteractionExecutor<T extends Interaction = CommandInteraction> {
  (interaction: T): Promise<void>;
}

export type SubcommandObject = Collection<string, Subcommand>;

export enum CommandMethod {
  EXECUTE,
  SHOW_AUTOCOMPLETE
}

export interface BaseCommand {
  execute: InteractionExecutor;
  showAutocomplete?: InteractionExecutor<AutocompleteInteraction>;
  subcommands: SubcommandObject;
}

export interface Subcommand extends BaseCommand {
  name: string;
}

export interface Command extends BaseCommand {
  data: SlashCommandBuilder;
}