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
  InteractionCollector,
  Message,
  MessageActionRow,
  MessageActionRowComponent,
  MessageComponentInteraction,
  MessageSelectMenu,
  Snowflake,
} from "discord.js";
import { v4 } from "uuid";

import logError from "./logError";
import serializeMessageComponentInteraction from "./logError/serializeMessageComponentInteraction";
import { MessageOptions, sendMessage } from "./multiMessage";

export interface CollectedComponent<T extends MessageActionRowComponent> {
  component: T;
  collector: CustomCollector;
  interaction: MessageComponentInteraction;
}

export interface CustomCollectorComponent<T extends MessageActionRowComponent> {
  component: T;
  collector: (item: CollectedComponent<T>) => Promise<void>;
}

/**
 * Custom collector that automatically filters by ID.
 */
export class CustomCollector {
  readonly components: CustomCollectorComponent<MessageActionRowComponent>[] =
    [];
  private _currentRow: MessageActionRowComponent[] = [];
  readonly rows: MessageActionRow[] = [];
  readonly randomCustomIdPrefix: string;
  private _message: Message;
  readonly name: string;

  constructor(name = "customCollector") {
    this.randomCustomIdPrefix = v4().replace(/-/g, "").toLowerCase();
    this.name = name;
  }

  get message(): Message {
    return this._message;
  }

  private compactIntoMessageActionRow() {
    this.rows.push(new MessageActionRow().addComponents(...this._currentRow));
    this._currentRow = [];
  }

  private manipulateComponent(component: MessageActionRowComponent) {
    if (component.customId !== null) {
      component.setCustomId(this.randomCustomIdPrefix + "_" + component.customId);
    }
  }

  addComponent(
    component: MessageActionRowComponent,
    onCollect: (
      data: CollectedComponent<MessageActionRowComponent>
    ) => Promise<void>
  ): this {
    if (
      this._currentRow.length === 5 ||
      (component instanceof MessageSelectMenu && this._currentRow.length > 0)
    ) {
      this.compactIntoMessageActionRow();
    }
    this.manipulateComponent(component);
    this.components.push({
      component,
      collector: onCollect,
    });
    this._currentRow.push(component);
    return this;
  }

  addActionRow(
    row: MessageActionRow,
    onCollect: ((
      data: CollectedComponent<MessageActionRowComponent>
    ) => Promise<void>)[]
  ): this {
    const customCollectorComponents = row.components.map((value, index) => {
      this.manipulateComponent(value);
      return {
        component: value,
        collector: onCollect[index],
      };
    });
    this.rows.push(row);
    this.components.push(...customCollectorComponents);
    return this;
  }

  async send(
    options: MessageOptions,
    collectMs: number
  ): Promise<
    [Message<boolean>, InteractionCollector<MessageComponentInteraction>]
  > {
    if (this._currentRow.length > 0) {
      this.compactIntoMessageActionRow();
    }
    const message = (await sendMessage({
      components: this.rows,
      ...options,
    })) as Message;
    this._message = message;
    const collector: InteractionCollector<MessageComponentInteraction> =
      await message.createMessageComponentCollector({
        idle: collectMs,
        filter: (component) =>
          component.customId.startsWith(this.randomCustomIdPrefix),
      });
    collector.on(
      "collect",
      async (interaction: MessageComponentInteraction) => {
        if (this.onCollect) {
          try {
            await this.onCollect(interaction, this);
          } catch (e) {
            logError(e, "CustomCollector::collect::globalOnCollect", {
              name: this.name,
              interaction: serializeMessageComponentInteraction(interaction),
            });
          }
        }
        const customId = interaction.customId;
        const component = this.components.find(
          (value) => value.component.customId === customId
        )!;
        try {
          await component.collector({
            component: component.component,
            interaction,
            collector: this,
          });
        } catch (e) {
          await interaction.reply(
            "An error occurred while running this button action. The error has been logged."
          );
          await logError(e, "CustomCollector::collect::componentCollect", {
            name: this.name,
            interaction: serializeMessageComponentInteraction(interaction),
          });
        }
      }
    );
    collector.on(
      "end",
      async (
        collected: Collection<Snowflake, MessageActionRowComponent>,
        reason: string
      ) => {
        try {
          if (this.onEnd) {
            await this.onEnd(collected, reason, this);
          }
        } catch (e) {
          logError(e, "CustomCollector::end::globalOnEnd", {
            name: this.name,
            reason: reason,
          });
        }
      }
    );
    return [message, collector];
  }

  onCollect?: (
    interaction: MessageComponentInteraction,
    customCollector: this
  ) => Promise<void>;
  onEnd?: (
    collected: Collection<Snowflake, MessageActionRowComponent>,
    reason: string,
    customCollector: this
  ) => Promise<void>;
}
