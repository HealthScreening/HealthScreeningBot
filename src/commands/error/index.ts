import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";

import { Command, Subcommand, SubcommandGroup } from "../../client/command";
import checkOwner from "../../utils/checkOwner";
import { ItemType } from "../../utils/multiMessage";
import ErrorDeleteCommand from "./delete";
import ErrorLogCommand from "./log";
import ErrorPostCommand from "./post";
import ErrorViewCommand from "./view";

export default class ErrorCommand extends Command {
  public subcommandGroups: Collection<string, SubcommandGroup> = new Collection(
    Object.entries({
      log: new ErrorLogCommand(),
    })
  );
  public subcommands: Collection<string, Subcommand> = new Collection(
    Object.entries({
      post: new ErrorPostCommand(),
      view: new ErrorViewCommand(),
      delete: new ErrorDeleteCommand(),
    })
  );
  public readonly data = new SlashCommandBuilder()
    .setName("error")
    .setDescription("Interact with the bot's error log.")
    .addSubcommandGroup(
      this.subcommandGroups
        .get("log")!
        .registerSubcommandGroup.bind(this.subcommandGroups.get("log"))
    )
    .addSubcommand(
      this.subcommands
        .get("view")!
        .registerSubcommand.bind(this.subcommands.get("view"))
    )
    .addSubcommand(
      this.subcommands
        .get("post")!
        .registerSubcommand.bind(this.subcommands.get("post"))
    )
    .addSubcommand(
      this.subcommands
        .get("delete")!
        .registerSubcommand.bind(this.subcommands.get("delete"))
    ) as SlashCommandBuilder;

  async beforeExecute(interaction): Promise<boolean> {
    return await checkOwner({
      itemType: ItemType.interaction,
      item: interaction,
    });
  }
}
