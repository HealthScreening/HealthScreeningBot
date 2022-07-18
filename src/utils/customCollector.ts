import {
  Collection,
  InteractionCollector,
  Message,
  ActionRow,
  ActionRowComponent,
  MessageComponentInteraction,
  MessageSelectMenu,
  Snowflake,
} from "discord.js";
import { v4 } from "uuid";

import logError from "./logError";
import serializeMessageComponentInteraction from "./logError/serializeMessageComponentInteraction";
import { ItemType, MessageOptions, sendMessage } from "./multiMessage";

export interface CollectedComponent<T extends ActionRowComponent> {
  component: T;
  // eslint-disable-next-line no-use-before-define -- These depend on each other so there's nothing I can do
  collector: CustomCollector;
  interaction: MessageComponentInteraction;
}

export interface CustomCollectorComponent<T extends ActionRowComponent> {
  component: T;
  collector: (item: CollectedComponent<T>) => Promise<void>;
}

/**
 * Custom collector that automatically filters by ID.
 */
export class CustomCollector {
  readonly components: CustomCollectorComponent<ActionRowComponent>[] =
    [];

  private _currentRow: ActionRowComponent[] = [];

  readonly rows: ActionRow[] = [];

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

  private compactIntoActionRow() {
    this.rows.push(new ActionRow().addComponents(...this._currentRow));
    this._currentRow = [];
  }

  private manipulateComponent(component: ActionRowComponent) {
    if (component.customId === null) {
      component.setCustomId(v4().replace(/-/g, "").toLowerCase());
    }

    component.setCustomId(`${this.randomCustomIdPrefix}_${component.customId}`);
  }

  addComponent(
    component: ActionRowComponent,
    onCollect: (
      data: CollectedComponent<ActionRowComponent>
    ) => Promise<void>
  ): this {
    if (
      this._currentRow.length === 5 ||
      (component instanceof MessageSelectMenu && this._currentRow.length > 0) ||
      (this._currentRow.length > 0 &&
        this._currentRow[0] instanceof MessageSelectMenu)
    ) {
      this.compactIntoActionRow();
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
    row: ActionRow,
    onCollect: ((
      data: CollectedComponent<ActionRowComponent>
    ) => Promise<void>)[]
  ): this {
    if (
      this._currentRow.length === 5 ||
      (this._currentRow.length > 0 &&
        this._currentRow[0] instanceof MessageSelectMenu)
    ) {
      this.compactIntoActionRow();
    }

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
      this.compactIntoActionRow();
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

        const { customId } = interaction;
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
          await sendMessage({
            itemType: ItemType.interaction,
            item: interaction,
            content:
              "An error occurred while running this button action. The error has been logged.",
          });
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
        collected: Collection<Snowflake, ActionRowComponent>,
        reason: string
      ) => {
        try {
          if (this.onEnd) {
            await this.onEnd(collected, reason, this);
          }
        } catch (e) {
          logError(e, "CustomCollector::end::globalOnEnd", {
            name: this.name,
            reason,
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
    collected: Collection<Snowflake, ActionRowComponent>,
    reason: string,
    customCollector: this
  ) => Promise<void>;
}
