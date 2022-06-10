import { AutocompleteInteraction, CommandInteraction } from "discord.js";

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
