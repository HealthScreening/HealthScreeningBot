import { SlashCommandBuilder } from "@discordjs/builders";
import { AutocompleteInteraction, Collection, CommandInteraction, Interaction } from "discord.js";

export interface InteractionExecutor<T extends Interaction> {
  (interaction: T): Promise<void>;
}

export abstract class Subcommand {
  abstract execute: InteractionExecutor<CommandInteraction>;
  public autocompleteFields: Collection<string | number, InteractionExecutor<AutocompleteInteraction>> = new Collection()
}

export abstract class Command extends Subcommand {
  public data: SlashCommandBuilder
  public subcommands: Collection<string, Subcommand> = new Collection();
}