import { Collection, SlashCommandSubcommandGroupBuilder } from "discord.js";

import { Subcommand, SubcommandGroup } from "../../../client/command";
import ErrorLogPruneCommand from "./prune";
import ErrorLogViewCommand from "./view";

export default class ErrorLogCommand extends SubcommandGroup {
  public subcommands: Collection<string, Subcommand> = new Collection(
    Object.entries({
      view: new ErrorLogViewCommand(),
      prune: new ErrorLogPruneCommand(),
    })
  );

  registerSubcommandGroup(subcommandGroup: SlashCommandSubcommandGroupBuilder) {
    return subcommandGroup
      .setName("log")
      .setDescription("Interact with multiple errors from the error log")
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
