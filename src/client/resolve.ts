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
import { Collection } from "discord.js";
import { readdir } from "fs/promises";
import { resolve } from "path";
import { Command, SubcommandObject } from "./interfaces";

async function resolveSubcommands(basePath: string, folderName: string): Promise<SubcommandObject> {
  try {
    const files = (await readdir(resolve(basePath, folderName))).filter((file) => file.endsWith(".js"));
    const subcommands: SubcommandObject = new Collection();
    for (const file of files) {
      const subcommand = require(resolve(basePath, folderName, file));
      subcommands.set(subcommand.name, subcommand);
    }
    return subcommands;
  } catch (error) {
    return new Collection();
  }
}

async function resolveCommand(basePath: string, name: string): Promise<Command> {
  const fileWithoutExtension = name.replace(".js", "");
  const command: Command = require(resolve(basePath, name));
  command.subcommands = await resolveSubcommands(basePath, fileWithoutExtension);
  for (const subcommandGroup of command.subcommands.values()) {
    subcommandGroup.subcommands = await resolveSubcommands(basePath, fileWithoutExtension + "/" + subcommandGroup.name);
  }
  return command;
}

export default async function resolveCommands(): Promise<Collection<string, Command>>  {
  const commandPath = resolve(__dirname, "..", "commands");
  const commandFiles = (await readdir(commandPath)).filter((file) => file.endsWith(".js"));
  const promises:  Promise<void>[] = [];
  const commands: Collection<string, Command> = new Collection();
  for (const file of commandFiles) {
    promises.push(
      resolveCommand(commandPath, file).then((command) => {
        commands.set(command.data.name, command);
      })
    )
  }
  await Promise.all(promises)
  return commands;
}