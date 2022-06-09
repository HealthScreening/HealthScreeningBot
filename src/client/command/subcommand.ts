import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { Collection } from "discord.js";

import { BaseCommand } from "./baseCommand";
import { SubcommandContainer } from "./subcommandContainer";
import { SubcommandGroup } from "./subcommandGroup";

export abstract class Subcommand extends BaseCommand {
  abstract registerSubcommand(
    subcommandGroup: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder;
}

export abstract class Command
  extends BaseCommand
  implements SubcommandContainer
{
  public abstract readonly data: SlashCommandBuilder;

  public subcommands: Collection<string, Subcommand> = new Collection();

  public subcommandGroups: Collection<string, SubcommandGroup> =
    new Collection();
}
