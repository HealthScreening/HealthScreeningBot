import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  MessageComponentInteraction,
  Snowflake,
} from "discord.js";

import { CollectedComponent, CustomCollector } from "./customCollector";
import logError from "./logError";
import serializeMessageComponentInteraction from "./logError/serializeMessageComponentInteraction";
import { MessageOptions } from "./multiMessage";

export default class Paginator {
  readonly pages: EmbedBuilder[];

  readonly timeout: number;

  private readonly collector: CustomCollector = new CustomCollector();

  private _lastInteraction: MessageComponentInteraction | null = null;

  private _disableButtonBuilders = true;

  private readonly toBeginningButtonBuilder = new ButtonBuilder()
    .setCustomId("tobeginning")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("922315496613879828");

  private readonly lastButtonBuilder = new ButtonBuilder()
    .setCustomId("last")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("922315496660021248");

  private readonly nextButtonBuilder = new ButtonBuilder()
    .setCustomId("next")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("922315496563560538");

  private readonly toEndButtonBuilder = new ButtonBuilder()
    .setCustomId("toend")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("922315496228003841");

  private readonly discardButtonBuilder = new ButtonBuilder()
    .setCustomId("discard")
    .setStyle(ButtonStyle.Danger)
    .setEmoji("922315496559349800");

  private readonly actionRow: ActionRowBuilder<MessageActionRowComponentBuilder>;

  constructor(pages: EmbedBuilder[], timeout = 120000) {
    if (pages.length === 0) {
      throw new Error("No pages provided");
    }

    this.pages = pages.map((page, index) =>
      page.setFooter({ text: `Page ${index + 1}/${pages.length}` })
    );
    this.timeout = timeout;
    this._currentPage = 0;
    this.actionRow =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        this.toBeginningButtonBuilder,
        this.lastButtonBuilder,
        this.nextButtonBuilder,
        this.toEndButtonBuilder,
        this.discardButtonBuilder
      );
    this.loadButtonBuilders();
  }

  private _currentPage: number;

  get currentPage(): number {
    return this._currentPage;
  }

  singlePage(): boolean {
    return this.pages.length === 1;
  }

  async send(options: MessageOptions) {
    if (options.ephemeral) {
      this._disableButtonBuilders = false;
    }

    return this.collector.send(
      {
        embeds: [this.pages[this._currentPage]],
        components: this.singlePage() ? [] : [this.actionRow],
        ...options,
      },
      this.timeout
    );
  }

  private setButtonBuilderState() {
    if (this._currentPage === 0) {
      this.toBeginningButtonBuilder.setDisabled(true);
      this.lastButtonBuilder.setDisabled(true);
    } else {
      this.toBeginningButtonBuilder.setDisabled(false);
      this.lastButtonBuilder.setDisabled(false);
    }

    if (this._currentPage === this.pages.length - 1) {
      this.toEndButtonBuilder.setDisabled(true);
      this.nextButtonBuilder.setDisabled(true);
    } else {
      this.toEndButtonBuilder.setDisabled(false);
      this.nextButtonBuilder.setDisabled(false);
    }
  }

  private disableActionRowBuilder() {
    for (const component of this.actionRow.components) {
      component.setDisabled(true);
    }
  }

  private async disablePaginator(options: CollectedComponent<ButtonBuilder>) {
    this.disableActionRowBuilder();
    return options.interaction.update({
      components: [this.actionRow],
    });
  }

  private async setPage(
    page: number,
    options: CollectedComponent<ButtonBuilder>
  ) {
    if (page < 0 || page >= this.pages.length) {
      await options.interaction.reply(
        "Tried to access an invalid page, this should not happen! Error has been logged."
      );
      await logError(Error("Page is out of bounds!"), "paginator::setPage", {
        currentPage: this._currentPage,
        targetPage: page,
        interaction: serializeMessageComponentInteraction(options.interaction),
      });
      return;
    }

    this._currentPage = page;
    this.setButtonBuilderState();
    this._lastInteraction = options.interaction;
    options.interaction.update({
      embeds: [this.pages[page]],
      components: [this.actionRow],
    });
  }

  private loadButtonBuilders() {
    this.collector.addActionRowBuilder(this.actionRow, [
      async (options: CollectedComponent<ButtonBuilder>) => {
        await this.setPage(0, options);
      },
      async (options: CollectedComponent<ButtonBuilder>) => {
        await this.setPage(this._currentPage - 1, options);
      },
      async (options: CollectedComponent<ButtonBuilder>) => {
        await this.setPage(this._currentPage + 1, options);
      },
      async (options: CollectedComponent<ButtonBuilder>) => {
        await this.setPage(this.pages.length - 1, options);
      },
      async (options: CollectedComponent<ButtonBuilder>) => {
        await this.disablePaginator(options);
      },
    ]);
    this.setButtonBuilderState();
    this.collector.onEnd = async function (
      collected: Collection<Snowflake, MessageActionRowComponentBuilder>,
      reason: string,
      customCollector: CustomCollector
    ) {
      if (this.singlePage()) {
        return;
      }

      this.disableActionRowBuilder();
      if (this._lastInteraction !== null) {
        await this._lastInteraction.editReply({
          components: [this.actionRow],
        });
      } else if (this._disableButtonBuilders) {
        await customCollector.message.edit({
          components: [this.actionRow],
        });
      }
    }.bind(this);
  }
}
