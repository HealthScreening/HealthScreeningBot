import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import {
  AutocompleteInteraction,
  Collection,
  CommandInteraction,
} from "discord.js";

import { Subcommand } from ".";
import { PreCommandChecks } from "./preCommandChecks";
import { SubcommandContainer } from "./subcommandContainer";

// eslint-disable-next-line import/prefer-default-export -- Some nasty export errors occur when making this a default.
export abstract class SubcommandGroup
  implements PreCommandChecks, SubcommandContainer
{
  public subcommands: Collection<string, Subcommand> = new Collection();

  abstract registerSubcommandGroup(
    subcommandGroup: SlashCommandSubcommandGroupBuilder
  ): SlashCommandSubcommandGroupBuilder;

  beforeExecute?(interaction: CommandInteraction): Promise<boolean>;

  beforeAutocomplete?(interaction: AutocompleteInteraction): Promise<boolean>;
}
