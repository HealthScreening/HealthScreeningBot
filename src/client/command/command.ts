import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";

import { BaseCommand } from "./baseCommand";
import { Subcommand } from "./subcommand";
import { SubcommandContainer } from "./subcommandContainer";
import { SubcommandGroup } from "./subcommandGroup";

// eslint-disable-next-line import/prefer-default-export -- Some nasty export errors occur when making this a default.
export abstract class Command
  extends BaseCommand
  implements SubcommandContainer
{
  public abstract readonly data: SlashCommandBuilder;

  public subcommands: Collection<string, Subcommand> = new Collection();

  public subcommandGroups: Collection<string, SubcommandGroup> =
    new Collection();
}
