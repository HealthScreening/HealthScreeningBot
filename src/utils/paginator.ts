import {
  MessageActionRow,
  MessageEmbed,
  MessageButton,
  MessageComponentInteraction,
  Collection,
  Snowflake,
  MessageActionRowComponent,
} from "discord.js";
import { CollectedComponent, CustomCollector } from "./customCollector";
import { MessageOptions } from "./multiMessage";
import logError from "./logError";
import serializeMessageComponentInteraction from "./logError/serializeMessageComponentInteraction";

export default class Paginator {
  readonly pages: MessageEmbed[];
  readonly timeout: number;
  private _currentPage: number;
  private readonly collector: CustomCollector = new CustomCollector();
  private _lastInteraction: MessageComponentInteraction | null = null;

  private readonly toBeginningButton = new MessageButton()
    .setCustomId("tobeginning")
    .setStyle("PRIMARY")
    .setEmoji("922315496613879828");

  private readonly lastButton = new MessageButton()
    .setCustomId("last")
    .setStyle("PRIMARY")
    .setEmoji("922315496660021248");

  private readonly nextButton = new MessageButton()
    .setCustomId("next")
    .setStyle("PRIMARY")
    .setEmoji("922315496563560538");

  private readonly toEndButton = new MessageButton()
    .setCustomId("toend")
    .setStyle("PRIMARY")
    .setEmoji("922315496228003841");

  private readonly discardButton = new MessageButton()
    .setCustomId("discard")
    .setStyle("DANGER")
    .setEmoji("922315496559349800");

  private readonly actionRow: MessageActionRow;

  private _disableButtons: boolean = true;

  constructor(pages: MessageEmbed[], timeout = 120000) {
    if (pages.length === 0) {
      throw new Error("No pages provided");
    }
    this.pages = pages.map((page, index) =>
      page.setFooter(`Page ${index + 1}/${pages.length}`)
    );
    this.timeout = timeout;
    this._currentPage = 0;
    this.actionRow = new MessageActionRow().addComponents(
      this.toBeginningButton,
      this.lastButton,
      this.nextButton,
      this.toEndButton,
      this.discardButton
    );
    [
      this.toBeginningButton,
      this.lastButton,
      this.nextButton,
      this.toEndButton,
      this.discardButton,
    ] = this.actionRow.components as MessageButton[];
    this.loadButtons();
  }

  get currentPage(): number {
    return this._currentPage;
  }

  private setButtonState() {
    if (this._currentPage === 0) {
      this.toBeginningButton.setDisabled(true);
      this.lastButton.setDisabled(true);
    } else {
      this.toBeginningButton.setDisabled(false);
      this.lastButton.setDisabled(false);
    }
    if (this._currentPage === this.pages.length - 1) {
      this.toEndButton.setDisabled(true);
      this.nextButton.setDisabled(true);
    } else {
      this.toEndButton.setDisabled(false);
      this.nextButton.setDisabled(false);
    }
  }

  private disableActionRow() {
    for (const component of this.actionRow.components) {
      component.setDisabled(true);
    }
  }

  private async disablePaginator(options: CollectedComponent<MessageButton>) {
    this.disableActionRow();
    return await options.interaction.update({
      components: [this.actionRow],
    });
  }

  private async setPage(
    page: number,
    options: CollectedComponent<MessageButton>
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
    this.setButtonState();
    this._lastInteraction = options.interaction;
    return await options.interaction.update({
      embeds: [this.pages[page]],
      components: [this.actionRow],
    });
  }

  private loadButtons() {
    this.collector.addActionRow(this.actionRow, [
      async (options: CollectedComponent<MessageButton>) => {
        await this.setPage(0, options);
      },
      async (options: CollectedComponent<MessageButton>) => {
        await this.setPage(this._currentPage - 1, options);
      },
      async (options: CollectedComponent<MessageButton>) => {
        await this.setPage(this._currentPage + 1, options);
      },
      async (options: CollectedComponent<MessageButton>) => {
        await this.setPage(this.pages.length - 1, options);
      },
      async (options: CollectedComponent<MessageButton>) => {
        await this.disablePaginator(options);
      },
    ]);
    this.setButtonState();
    this.collector.onEnd = async function (
      collected: Collection<Snowflake, MessageActionRowComponent>,
      reason: string,
      customCollector: CustomCollector
    ) {
      this.disableActionRow();
      if (this._lastInteraction !== null) {
        await this._lastInteraction.editReply({
          components: [this.actionRow],
        });
      } else if (this._disableButtons) {
        await customCollector.message.edit({
          components: [this.actionRow],
        });
      }
    }.bind(this);
  }

  async send(options: MessageOptions) {
    if (options.ephemeral) {
      this._disableButtons = false;
    }
    return await this.collector.send(
      {
        embeds: [this.pages[this._currentPage]],
        components: this.pages.length === 1 ? [] : [this.actionRow],
        ...options,
      },
      this.timeout
    );
  }
}
