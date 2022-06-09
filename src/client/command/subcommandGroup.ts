import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import {
  AutocompleteInteraction,
  Collection,
  CommandInteraction,
} from "discord.js";

import { Subcommand } from "../command";
import { PreCommandChecks } from "./preCommandChecks";
import { SubcommandContainer } from "./subcommandContainer";

export abstract class SubcommandGroup
  implements PreCommandChecks, SubcommandContainer
{
  abstract registerSubcommandGroup(
    subcommandGroup: SlashCommandSubcommandGroupBuilder
  ): SlashCommandSubcommandGroupBuilder;

  public subcommands: Collection<string, Subcommand> = new Collection();
  beforeExecute?(interaction: CommandInteraction): Promise<boolean>;
  beforeAutocomplete?(interaction: AutocompleteInteraction): Promise<boolean>;
}
