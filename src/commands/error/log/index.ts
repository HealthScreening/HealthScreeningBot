import { SlashCommandSubcommandGroupBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";

import { Subcommand, SubcommandGroup } from "../../../client/command";
import ErrorLogViewCommand from "./view";

export default class ErrorLogCommand extends SubcommandGroup {
  public subcommands: Collection<string, Subcommand> = new Collection(
    Object.entries({
      view: new ErrorLogViewCommand(),
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
      );
  }
}
