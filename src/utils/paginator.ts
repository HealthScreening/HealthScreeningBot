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
  Collection,
  MessageActionRow,
  MessageActionRowComponent,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
  Snowflake,
} from "discord.js";

import { CollectedComponent, CustomCollector } from "./customCollector";
import logError from "./logError";
import serializeMessageComponentInteraction from "./logError/serializeMessageComponentInteraction";
import { MessageOptions } from "./multiMessage";

export default class Paginator {
  readonly pages: MessageEmbed[];
  readonly timeout: number;
  private _currentPage: number;
  private readonly collector: CustomCollector = new CustomCollector();

  private _lastInteraction: MessageComponentInteraction | null = null;
  private _disableButtons = true;

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
