/**
 * Copyright (C) 2021 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";
import checkOwner from "../../utils/checkOwner";
import { ItemType } from "../../utils/multiMessage";
import { Command, Subcommand, SubcommandGroup } from "../../client/command";
import ErrorLogCommand from "./log";
import ErrorViewCommand from "./view";
import ErrorPostCommand from "./post";

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
    ) as SlashCommandBuilder;

  async beforeExecute(interaction): Promise<boolean> {
    return await checkOwner({
      itemType: ItemType.interaction,
      item: interaction,
    });
  }
}
