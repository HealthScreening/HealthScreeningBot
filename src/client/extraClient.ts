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
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { ScreeningClient } from "../screeningClient";
import { ItemType } from "../utils/multiMessage";
import assignAutoSchoolRole from "./autoAssignSchoolRole";
import doAutoLoop from "./doAutoLoop";
import logError from "../utils/logError";
import { WorkerQueue } from "../utils/workerQueue";
import postToGithub from "../utils/postToGithub";
import sleep from "sleep-promise";
import doGuildMemberCacheUpdate from "./doGuildMemberCacheUpdate";
import runFunctionAndLogError from "../utils/logError/runAndLog";
import commandInteraction from "./interactions/commandInteraction";
import {
  HSBAutocompleteInteraction,
  HSBCommandInteraction,
  HSBMessageComponentInteraction,
} from "../discordjs-overrides";
import commandInteractionAutocomplete from "./interactions/commandInteractionAutocomplete";
import { Command } from "./command";
import ErrorCommand from "../commands/error";
import DeleteAuto from "../commands/deleteAuto";
import GenerateAuto from "../commands/generateAuto";
import GenerateOnce from "../commands/generateOnce";
import Profile from "../commands/profile";
import SendToAll from "../commands/sendToAll";
import SetAuto from "../commands/setAuto";
import SetCommand from "../commands/setCommand";
import Stats from "../commands/stats";
import StopBot from "../commands/stopBot";
import TestScreening from "../commands/testScreening";
import TriggerAutoNow from "../commands/triggerAutoNow";
import messageComponentInteraction from "./interactions/messageComponentInteraction";
import deleteButton from "../buttons/delete";
import { getGuidePath } from "../utils/guides";
import Guide from "../commands/guide";
import goToDMButton from "../buttons/goToDM";

const GENERATE_AUTO_CHOICES = [
  "hsb/generateauto",
  "hsb/generate-auto",
  "hsb/generate_auto",
];

export interface GuideData {
  /**
   * Either a string for all pages, or an array of strings for each page.
   */
  title?: string | string[];
  files?: string[];
  embeds?: MessageEmbed[];
}

export default class HealthScreeningBotClient extends Client {
  public commands: Collection<string, Command> = new Collection(
    Object.entries({
      error: new ErrorCommand(),
      delete_auto: new DeleteAuto(),
      generate_auto: new GenerateAuto(),
      generate_once: new GenerateOnce(),
      guide: new Guide(),
      profile: new Profile(),
      send_to_all: new SendToAll(),
      set_auto: new SetAuto(),
      set: new SetCommand(),
      stats: new Stats(),
      stop: new StopBot(),
      test_screening: new TestScreening(),
      trigger_auto: new TriggerAutoNow(),
    })
  );
  public readonly screeningClient: ScreeningClient = new ScreeningClient();
  public readonly githubQueue: WorkerQueue<[string, string], void> =
    new WorkerQueue({
      worker: async (args) => {
        await postToGithub(...args);
        await sleep(10 * 1000);
      },
      limit: 1,
    });
  public readonly globalButtons: Collection<
    string,
    (interaction: HSBMessageComponentInteraction) => Promise<void>
  > = new Collection(
    Object.entries({
      delete: deleteButton,
      go_to_dm: goToDMButton,
    })
  );
  /**
   * Guides can either be an array of message embeds *or* an array of paths to check for the pages.
   * If providing paths, they must be relative to the root of the guides folder at the
   * root of the project, not the root of the source.
   */
  public readonly guideData: Collection<string, GuideData> = new Collection(
    Object.entries({
      rules: {
        title: "Rules",
        files: [getGuidePath("rules")],
      },
      quickstart: {
        title: "Quickstart",
        files: [getGuidePath("quickstart")],
      },
      post_set_auto: {
        title: "Post Set Auto",
        files: [getGuidePath("post_set_auto")],
      },
      whats_new_version_2_1: {
        title: "What's New in Version 2.1",
        files: [getGuidePath("whats_new_version_2_1")],
      },
      whats_new_version_2_4: {
        title: "What's New in Version 2.3",
        files: [getGuidePath("whats_new_version_2_4")],
      },
      _send_to_all_whats_new_2_1_and_2_4: {
        title: ["What's New in Version 2.1", "What's New in Version 2.4"],
        files: [
          getGuidePath("whats_new_version_2_1"),
          getGuidePath("whats_new_version_2_4"),
        ],
      },
      guides: {
        title: "Guide List",
        files: [getGuidePath("guides")],
      },
      contributing_a_guide: {
        title: "Contributing a Guide",
        files: [getGuidePath("contributing_a_guide")],
      },
    })
  );
  constructor(options: ClientOptions) {
    super(options);
    this.loadEventListeners();
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
        case "MESSAGE_COMPONENT":
          return await messageComponentInteraction(
            interaction as HSBMessageComponentInteraction
          );
      }
    } catch (e) {
      await logError(e, "interaction");
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
