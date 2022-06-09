import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";

import { Command, Subcommand, SubcommandGroup } from "../../client/command";
import checkOwner from "../../utils/checkOwner";
import { ItemType } from "../../utils/multiMessage";
import CommandDeleteCommand from "./delete";
import CommandLogCommand from "./log";
import CommandViewCommand from "./view";

export default class CommandCommand extends Command {
  public subcommandGroups: Collection<string, SubcommandGroup> = new Collection(
    Object.entries({
      log: new CommandLogCommand(),
    })
  );

  public subcommands: Collection<string, Subcommand> = new Collection(
    Object.entries({
      view: new CommandViewCommand(),
      delete: new CommandDeleteCommand(),
    })
  );

  public readonly data = new SlashCommandBuilder()
    .setName("command")
    .setDescription("Interact with the bot's command log.")
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
        .get("delete")!
        .registerSubcommand.bind(this.subcommands.get("delete"))
    ) as SlashCommandBuilder;

  async beforeExecute(interaction): Promise<boolean> {
    return checkOwner({
      itemType: ItemType.interaction,
      item: interaction,
    });
  }
}
