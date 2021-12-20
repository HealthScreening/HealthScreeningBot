import { MessageActionRow, MessageEmbed, MessageButton } from "discord.js";
import { CollectedComponent, CustomCollector } from "./customCollector";
import { MessageOptions } from "./multiMessage";

export default class Paginator {
  readonly pages: MessageEmbed[];
  readonly timeout: number;
  private _currentPage: number;
  private readonly collector: CustomCollector = new CustomCollector();

  private readonly toBeginningButton = new MessageButton()
    .setCustomId("tobeginning")
    .setStyle("PRIMARY")
    .setEmoji("922315664578986015");

  private readonly lastButton = new MessageButton()
    .setCustomId("last")
    .setStyle("PRIMARY")
    .setEmoji("922315664578986015");

  private readonly nextButton = new MessageButton()
    .setCustomId("next")
    .setStyle("PRIMARY")
    .setEmoji("922315664578986015");

  private readonly toEndButton = new MessageButton()
    .setCustomId("toend")
    .setStyle("PRIMARY")
    .setEmoji("922315664578986015");

  private readonly discardButton = new MessageButton()
    .setCustomId("discard")
    .setStyle("DANGER")
    .setEmoji("922315664578986015");

  private readonly actionRow = new MessageActionRow().addComponents(
    this.toBeginningButton,
    this.lastButton,
    this.nextButton,
    this.toEndButton,
    this.discardButton
  );

  constructor(pages: MessageEmbed[], timeout: number = 120000) {
    if (pages.length === 0) {
      throw new Error("No pages provided");
    }
    this.pages = pages.map((page, index) =>
      page.setFooter(`Page ${index + 1}/${pages.length}`)
    );
    this.timeout = timeout;
    this._currentPage = 0;
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

  private async disablePaginator(options: CollectedComponent<MessageButton>) {
    for (const component of this.actionRow.components) {
      component.setDisabled(true);
    }
    return await options.interaction.editReply({
      components: [this.actionRow],
    });
  }

  private async setPage(
    page: number,
    options: CollectedComponent<MessageButton>
  ) {
    if (page < 0 || page >= this.pages.length) {
      throw Error("Page is out of bounds!");
    }
    this._currentPage = page;
    this.setButtonState();
    return await options.interaction.editReply({
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
  }

  async send(options: MessageOptions) {
    return await this.collector.send(options, this.timeout);
  }
}
