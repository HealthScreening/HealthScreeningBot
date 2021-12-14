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
  TextChannel
} from "discord.js";
import { ScreeningClient } from "../screeningClient";
import { ItemType } from "../utils/multiMessage";
import assignAutoSchoolRole from "./autoAssignSchoolRole";
import doAutoLoop from "./doAutoLoop";
import logError from "../utils/logError";
import { Command } from "./interfaces";
import resolveCommands from "./resolve";
import serializeInteraction from "../utils/logError/serializeInteraction";
import handleCommandError from "../utils/handleCommandError";

const GENERATE_AUTO_CHOICES = [
  "hsb/generateauto",
  "hsb/generate-auto",
  "hsb/generate_auto"
];



export default class HealthScreeningBotClient extends Client {
  private commands: Collection<string, Command>;
  public readonly screeningClient: ScreeningClient = new ScreeningClient();

  constructor(options: ClientOptions) {
    super(options);
    this.loadCommands();
    this.loadEventListeners();
  }

  public async loadCommands() {
    this.commands = await resolveCommands();
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
            replyMessage: message
          });
        }
      }
    } catch (e) {
      const metadata = {
        command: message.content,
        author: message.author.id,
        channel: message.channelId,
        guild: message.guildId
      };
      await logError(e, "textCommand", metadata);
      try {
        await message.reply({
          content: "There was an error while executing this command!",
          failIfNotExists: false
        });
      } catch (e2) {
        await logError(e2, "textCommand::errorReply", metadata);
      }
    }
  }

  private async oninteractionCreate(interaction: CommandInteraction) {
    try {
      if (!interaction.isCommand()) return;

      console.debug(
        "%s%s ran %s",
        interaction.user.username,
        interaction.user.discriminator,
        interaction.commandName
      );

      const command: Command | undefined = this.commands.get(
        interaction.commandName
      );

      if (!command) {
        await logError(
          new Error(`Command ${interaction.commandName} not found`),
          "interactionCommand::commandNotFound",
          serializeInteraction(interaction)
        );
        await handleCommandError({itemType: ItemType.interaction, item: interaction}, interaction.commandName);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        const metadata: { [k: string]: any } = serializeInteraction(interaction);
        await logError(error, "interactionCommand", metadata);
        try {
          if (interaction.deferred || interaction.replied) {
            await interaction.followUp({
              content: "There was an error while executing this command!",
              ephemeral: true
            });
          }
          else {
            await interaction.reply({
              content: "There was an error while executing this command!",
              ephemeral: true
            });
          }
        } catch (e2) {
          metadata.deferred = interaction.deferred;
          metadata.replied = interaction.replied;
          await logError(e2, "interactionCommand::errorReply", metadata);
        }
      }
    } catch (e) {
      await logError(e, "interactionCommand::processing", serializeInteraction(interaction));
    }
  }

  private async doOnReady() {
    console.log(
      `Health Screening Bot is ready! Running as user ${this.user!.username}#${
        this.user!.discriminator
      }`
    );
    const logChannel: TextChannel = (await (
      await this.guilds.fetch("889983763994521610")
    ).channels.fetch("902375187150934037")) as TextChannel;
    await Promise.all([
      assignAutoSchoolRole(this),
      doAutoLoop(this, logChannel)
    ]);
  }
}
