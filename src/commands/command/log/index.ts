import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";

import { Subcommand, SubcommandGroup } from "../../../client/command";
import CommandLogPruneCommand from "./prune";
import CommandLogViewCommand from "./view";

export default class CommandLogCommand extends SubcommandGroup {
  public subcommands: Collection<string, Subcommand> = new Collection(
    Object.entries({
      view: new CommandLogViewCommand(),
      prune: new CommandLogPruneCommand(),
    })
  );

  registerSubcommandGroup(subcommandGroup: SlashCommandSubcommandGroupBuilder) {
    return subcommandGroup
      .setName("log")
      .setDescription(
        "Interact with multiple command log entries from the command log"
      )
      .addSubcommand(
        this.subcommands
          .get("view")!
          .registerSubcommand.bind(this.subcommands.get("view"))
      )
      .addSubcommand(
        this.subcommands
          .get("prune")!
          .registerSubcommand.bind(this.subcommands.get("prune"))
      );
  }
}
