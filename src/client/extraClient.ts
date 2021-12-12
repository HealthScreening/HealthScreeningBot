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
import {
  Client,
  ClientOptions,
  Collection,
  CommandInteraction,
  Message,
  TextChannel,
} from "discord.js";
import path from "path";
import fs from "fs";
import { ScreeningClient } from "../screeningClient";
import { ItemType } from "../utils/multiMessage";
import assignAutoSchoolRole from "./autoAssignSchoolRole";
import { SlashCommandBuilder } from "@discordjs/builders";
import doAutoLoop from "./doAutoLoop";

const GENERATE_AUTO_CHOICES = [
  "hsb/generateauto",
  "hsb/generate-auto",
  "hsb/generate_auto",
];

export interface Command {
  data: SlashCommandBuilder;

  execute(interaction: CommandInteraction): Promise<void>;
}

export default class HealthScreeningBotClient extends Client {
  private readonly commands: Collection<string, Command> = new Collection();
  public readonly screeningClient: ScreeningClient = new ScreeningClient();

  constructor(options: ClientOptions) {
    super(options);
    this.loadCommands();
    this.loadEventListeners();
  }

  private loadCommands() {
    const commandPath = path.resolve(__dirname, "..", "commands");
    const commandFiles = fs
      .readdirSync(commandPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      /* eslint-disable @typescript-eslint/no-var-requires -- Disabled because
      we dynamically require, which is impossible with typescript's import system. */
      const command: Command = require(path.resolve(commandPath, file));
      /* eslint-enable @typescript-eslint/no-var-requires */
      this.commands.set(command.data.name, command);
    }
  }

  private loadEventListeners() {
    for (const memberName of Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    )) {
      if (memberName.startsWith("on")) {
        this.on(memberName.substring(2), this[memberName].bind(this));
      }
    }
    this.once("ready", this.doOnReady.bind(this));
  }

  private async onmessageCreate(message: Message) {
    try {
      if (
        message.content &&
        message.content.substring(0, 4).toLowerCase() === "hsb/"
      ) {
        if (
          GENERATE_AUTO_CHOICES.includes(
            message.content.toLowerCase().replace(/\s+/g, "")
          )
        ) {
          await this.screeningClient.queueAutoCommand(message.author.id, {
            itemType: ItemType.message,
            item: message,
            replyMessage: message,
          });
        }
      }
    } catch (e) {
      console.error(e);
      try {
        await message.reply({
          content: "There was an error while executing this command!",
          failIfNotExists: false,
        });
      } catch (e2) {
        console.error(e2);
      }
    }
  }

  private async oninteractionCreate(interaction) {
    try {
      if (!interaction.isCommand()) return;

      console.debug(
        "%s%s ran %s",
        interaction.user.username,
        interaction.user.discriminator,
        interaction.commandName
      );

      const command: Command | undefined = this.commands.get(interaction.commandName);

      if (!command){
        console.error("Invalid command entered:", command);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        if (interaction.deferred || interaction.replied) {
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async doOnReady() {
    const logChannel: TextChannel = (await (
      await this.guilds.fetch("889983763994521610")
    ).channels.fetch("902375187150934037")) as TextChannel;
    await Promise.all([
      assignAutoSchoolRole(this),
      doAutoLoop(this, logChannel),
    ]);
  }
}
