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
      .setDescription("Interact with multiple command log entries from the command log")
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
