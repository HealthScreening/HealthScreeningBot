import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder
} from "@discordjs/builders";
import { AutocompleteInteraction, Collection, CommandInteraction } from "discord.js";

export interface PreCommandChecks {
  /**
   * A function that will run before an interaction is executed. The execute
   * function will run only when this function is true.
   *
   * This function should handle any notifying for failed checks, such as sending
   * a message for a reply.
   *
   * Note: Before execute functions of parent commands/groups are run prior to
   * the subcommand being executed. If any function returns false, the executor
   * will short-circuit.
   * @param interaction The interaction object.
   * @returns A boolean indicating whether the interaction should be executed.
   */
  beforeExecute?(interaction: CommandInteraction): Promise<boolean>;

  /**
   * A function that will run before an interaction is autocompleted. The
   * autocompleted function will run only when this function is true.
   *
   * Note: Before autocompleted functions of parent commands/groups are run
   * prior to the subcommand being autocompleted. If any function returns false,
   * the executor will short-circuit and return no autocompletions.
   * @param interaction The interaction object.
   * @returns A boolean indicating whether the interaction should be
   * autocompleted.
   */
  beforeAutocomplete?(interaction: AutocompleteInteraction): Promise<boolean>;
}

export interface SubcommandContainer {
  subcommands: Collection<string, Subcommand>
}

export abstract class BaseCommand implements PreCommandChecks {
  /**
   * The function that will run whenever this command is used as a slash command.
   * @param interaction The interaction object.
   */
  execute?(interaction: CommandInteraction): Promise<void>;

  /**
   * A mapping of fields that will support autocomplete to the functions that will
   * be executed when said fields are autocompleted.
   */
  public autocompleteFields: Collection<string, (interaction: AutocompleteInteraction) => Promise<void>> = new Collection();
  // Hack to silence typescript
  beforeExecute?(interaction: CommandInteraction): Promise<boolean>;
  beforeAutocomplete?(interaction: AutocompleteInteraction): Promise<boolean>;
}

export abstract class SubcommandGroup implements PreCommandChecks, SubcommandContainer {
  abstract registerSubcommandGroup(subcommandGroup: SlashCommandSubcommandGroupBuilder): SlashCommandSubcommandGroupBuilder
  public subcommands: Collection<string, Subcommand> = new Collection();
  beforeExecute?(interaction: CommandInteraction): Promise<boolean>;
  beforeAutocomplete?(interaction: AutocompleteInteraction): Promise<boolean>;
}

export abstract class Subcommand extends BaseCommand {
  abstract registerSubcommand(subcommandGroup: SlashCommandSubcommandBuilder): SlashCommandSubcommandBuilder
}

export abstract class Command extends BaseCommand implements SubcommandContainer {
  public readonly abstract data: SlashCommandBuilder;
  public subcommands: Collection<string, Subcommand> = new Collection();
  public subcommandGroups: Collection<string, SubcommandGroup> = new Collection();
}