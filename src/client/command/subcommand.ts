import { SlashCommandSubcommandBuilder } from "discord.js";

import { BaseCommand } from "./baseCommand";

// eslint-disable-next-line import/prefer-default-export -- Some nasty export errors occur when making this a default.
export abstract class Subcommand extends BaseCommand {
  abstract registerSubcommand(
    subcommandGroup: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder;
}
