import ConcurrentPriorityWorkerQueue from "concurrent-priority-worker-queue";
import {
  Client,
  ClientOptions,
  Collection,
  EmbedBuilder,
  Interaction,
  InteractionType,
  Message,
  TextChannel,
} from "discord.js";

import { discord } from "../../config";
import deleteButtonBuilder from "../buttons/delete";
import goToDMButtonBuilder from "../buttons/goToDM";
import CommandCommand from "../commands/command";
import DeleteAuto from "../commands/deleteAuto";
import ErrorCommand from "../commands/error";
import GenerateAuto from "../commands/generateAuto";
import GenerateOnce from "../commands/generateOnce";
import Guide from "../commands/guide";
import Profile from "../commands/profile";
import ReportBug from "../commands/reportBug";
import Reset from "../commands/reset";
import SendToAll from "../commands/sendToAll";
import SetAuto from "../commands/setAuto";
import SetCommand from "../commands/setCommand";
import Stats from "../commands/stats";
import StopBot from "../commands/stopBot";
import Suggest from "../commands/suggest";
import TestScreening from "../commands/testScreening";
import TriggerAutoNow from "../commands/triggerAutoNow";
import issueSets from "../data/githubIssueSets.json";
import {
  HSBAutocompleteInteraction,
  HSBCommandInteraction,
  HSBMessageComponentInteraction,
} from "../discordjs-overrides";
import ScreeningClient from "../screeningClient";
import logError from "../utils/logError";
import runFunctionAndLogError from "../utils/logError/runAndLog";
import { ItemType } from "../utils/multiMessage";
import postToGithub from "../utils/postToGithub";
import { Command } from "./command";
import doAutoChangePresence from "./doAutoChangePresence";
import doAutoLoop from "./doAutoLoop";
import commandInteraction from "./interactions/commandInteraction";
import commandInteractionAutocomplete from "./interactions/commandInteractionAutocomplete";
import messageComponentInteraction from "./interactions/messageComponentInteraction";

const GENERATE_AUTO_CHOICES = [
  "hsb/generateauto",
  "hsb/generate-auto",
  "hsb/generate_auto",
];

export default class HealthScreeningBotClient extends Client {
  public commands: Collection<string, Command> = new Collection(
    Object.entries({
      command: new CommandCommand(),
      error: new ErrorCommand(),
      delete_auto: new DeleteAuto(),
      generate_auto: new GenerateAuto(),
      generate_once: new GenerateOnce(),
      guide: new Guide(),
      profile: new Profile(),
      report_bug: new ReportBug(),
      reset: new Reset(),
      send_to_all: new SendToAll(),
      set_auto: new SetAuto(),
      set: new SetCommand(),
      stats: new Stats(),
      stop: new StopBot(),
      suggest: new Suggest(),
      test_screening: new TestScreening(),
      trigger_auto: new TriggerAutoNow(),
    })
  );

  public readonly screeningClient: ScreeningClient = new ScreeningClient();

  public readonly githubQueue: ConcurrentPriorityWorkerQueue<
    [string, string, keyof typeof issueSets],
    number | null
  > = new ConcurrentPriorityWorkerQueue({
    async worker(args) {
      return postToGithub(...args);
    },
    limit: 1,
  });

  public readonly globalButtonBuilders: Collection<
    string,
    (interaction: HSBMessageComponentInteraction) => Promise<void>
  > = new Collection(
    Object.entries({
      delete: deleteButtonBuilder,
      go_to_dm: goToDMButtonBuilder,
    })
  );

  /**
   * Guides can either be an array of message embeds *or* an array of paths to check for the pages.
   * If providing paths, they must be relative to the root of the guides folder at the
   * root of the project, not the root of the source.
   */
  public guideData: Collection<string, EmbedBuilder[]>;

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
          await message.reply(
            "This command is deprecated and may be removed in a future version of the bot. Please use `/generate_auto` instead."
          );
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

  private async oninteractionCreate(interaction: Interaction): Promise<void> {
    try {
      switch (interaction.type) {
        case InteractionType.ApplicationCommand:
          await commandInteraction(interaction as HSBCommandInteraction);
          break;
        case InteractionType.ApplicationCommandAutocomplete:
          await commandInteractionAutocomplete(
            interaction as HSBAutocompleteInteraction
          );
          break;
        case InteractionType.MessageComponent:
          await messageComponentInteraction(
            interaction as HSBMessageComponentInteraction
          );
          break;
        default:
          throw new Error(`Unknown interaction type: ${interaction.type}`);
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
      await this.guilds.fetch(discord.guildId)
    ).channels.fetch(discord.logChannelId)) as TextChannel;
    await Promise.all([
      runFunctionAndLogError(
        () => doAutoLoop(this, logChannel),
        "onReady::doAutoLoop"
      ),
      runFunctionAndLogError(
        () => doAutoChangePresence(this),
        "onReady::doAutoChangePresence"
      ),
    ]);
  }
}
