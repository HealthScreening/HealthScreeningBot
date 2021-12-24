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
  Interaction,
  Message,
  TextChannel,
} from "discord.js";
import { ScreeningClient } from "../screeningClient";
import { ItemType } from "../utils/multiMessage";
import assignAutoSchoolRole from "./autoAssignSchoolRole";
import doAutoLoop from "./doAutoLoop";
import logError from "../utils/logError";
import { Command } from "./interfaces";
import resolveCommands from "./resolve";
import { WorkerQueue } from "../utils/workerQueue";
import postToGithub from "../utils/postToGithub";
import sleep from "sleep-promise";
import doGuildMemberCacheUpdate from "./doGuildMemberCacheUpdate";
import runFunctionAndLogError from "../utils/logError/runAndLog";
import commandInteraction from "./interactions/commandInteraction";
import { HSBAutocompleteInteraction, HSBCommandInteraction } from "../discordjs-overrides";
import commandInteractionAutocomplete from "./interactions/commandInteractionAutocomplete";

const GENERATE_AUTO_CHOICES = [
  "hsb/generateauto",
  "hsb/generate-auto",
  "hsb/generate_auto",
];

export default class HealthScreeningBotClient extends Client {
  public commands: Collection<string, Command>;
  public readonly screeningClient: ScreeningClient = new ScreeningClient();
  public readonly githubQueue: WorkerQueue<[string, string], void> =
    new WorkerQueue({
      worker: async (args) => {
        await postToGithub(...args);
        await sleep(60 * 1000);
      },
      limit: 1,
    });

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
            replyMessage: message,
          });
        }
      }
    } catch (e) {
      const metadata = {
        command: message.content,
        author: message.author.id,
        channel: message.channelId,
        guild: message.guildId,
      };
      await logError(e, "textCommand", metadata);
      try {
        await message.reply({
          content: "There was an error while executing this command!",
          failIfNotExists: false,
        });
      } catch (e2) {
        await logError(e2, "textCommand::errorReply", metadata);
      }
    }
  }

  private async oninteractionCreate(interaction: Interaction) {
    try {
      switch (interaction.type) {
      case "APPLICATION_COMMAND":
        return await commandInteraction(interaction as HSBCommandInteraction);
      case "APPLICATION_COMMAND_AUTOCOMPLETE":
        return await commandInteractionAutocomplete(
          interaction as HSBAutocompleteInteraction
        );
      }
    } catch (e) {
      await logError(e, "interaction")
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
      runFunctionAndLogError(
        () => assignAutoSchoolRole(this),
        "onReady::assignAutoSchoolRole"
      ),
      runFunctionAndLogError(
        () => doAutoLoop(this, logChannel),
        "onReady::doAutoLoop"
      ),
      runFunctionAndLogError(
        () => doGuildMemberCacheUpdate(this),
        "onReady::doGuildMemberCacheUpdate"
      ),
    ]);
  }
}
