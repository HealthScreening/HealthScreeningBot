import {
  Collection,
  InteractionCollector,
  Message,
  ActionRowBuilder,
  MessageActionRowComponentBuilder,
  APIButtonComponentWithCustomId,
  MessageComponentInteraction,
  SelectMenuBuilder,
  Snowflake,
  Utils,
  ButtonBuilder,
  CollectedInteraction,
} from "discord.js";
import { v4 } from "uuid";

import logError from "./logError";
import serializeMessageComponentInteraction from "./logError/serializeMessageComponentInteraction";
import { ItemType, MessageOptions, sendMessage } from "./multiMessage";

export interface CollectedComponent<T extends MessageActionRowComponentBuilder = MessageActionRowComponentBuilder> {
  component: T;
  // eslint-disable-next-line no-use-before-define -- These depend on each other so there's nothing I can do
  collector: CustomCollector;
  interaction: MessageComponentInteraction;
}

export interface CustomCollectorComponent<T extends MessageActionRowComponentBuilder> {
  component: T;
  collector: (item: CollectedComponent<T>) => Promise<void>;
}

/**
 * Custom collector that automatically filters by ID.
 */
export class CustomCollector {
  readonly components: CustomCollectorComponent<MessageActionRowComponentBuilder>[] =
    [];

  private _currentRow: MessageActionRowComponentBuilder[] = [];

  readonly rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

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

  private compactIntoActionRowBuilder() {
    this.rows.push(new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(...this._currentRow));
    this._currentRow = [];
  }

  private manipulateComponent(component: MessageActionRowComponentBuilder) {
    if (component instanceof SelectMenuBuilder) {
      if (component.data.custom_id === null) {
        component.setCustomId(v4().replace(/-/g, "").toLowerCase());
      }
      component.setCustomId(`${this.randomCustomIdPrefix}_${component.toJSON().custom_id}`); // We already made sure `custom_id` exists prior.
    }
    else if (component instanceof ButtonBuilder && !Utils.isLinkButton(component.toJSON())) {
      if ((component.toJSON() as APIButtonComponentWithCustomId).custom_id === null) {
      component.setCustomId(v4().replace(/-/g, "").toLowerCase());
    }
      component.setCustomId(`${this.randomCustomIdPrefix}_${(component.toJSON() as APIButtonComponentWithCustomId).custom_id}`); // We already made sure `custom_id` exists prior.
    }
  }

  addComponent(
    component: MessageActionRowComponentBuilder,
    onCollect: (
      data: CollectedComponent
    ) => Promise<void>
  ): this {
    if (
      this._currentRow.length === 5 ||
      (component instanceof SelectMenuBuilder && this._currentRow.length > 0) ||
      (this._currentRow.length > 0 &&
        this._currentRow[0] instanceof SelectMenuBuilder)
    ) {
      this.compactIntoActionRowBuilder();
    }

    this.manipulateComponent(component);
    this.components.push({
      component,
      collector: onCollect,
    });
    this._currentRow.push(component);
    return this;
  }

  addActionRowBuilder(
    row: ActionRowBuilder<MessageActionRowComponentBuilder>,
    onCollect: ((
      data: CollectedComponent
    ) => Promise<void>)[]
  ): this {
    if (
      this._currentRow.length === 5 ||
      (this._currentRow.length > 0 &&
        this._currentRow[0] instanceof SelectMenuBuilder)
    ) {
      this.compactIntoActionRowBuilder();
    }

    const customCollectorComponents = row.components.map((value: MessageActionRowComponentBuilder, index) => {
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
    [Message<boolean>, InteractionCollector<CollectedInteraction>]
  > {
    if (this._currentRow.length > 0) {
      this.compactIntoActionRowBuilder();
    }

    const message = (await sendMessage({
      components: this.rows,
      ...options,
    })) as Message;
    this._message = message;
    const collector: InteractionCollector<CollectedInteraction> =
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
          (value) => {
            let comparingCustomId: string | null = null;
            if (value.component instanceof SelectMenuBuilder){
              comparingCustomId = value.component.toJSON().custom_id;
            } else if (value.component instanceof ButtonBuilder && !Utils.isLinkButton(value.component.toJSON())) {
              comparingCustomId = (value.component.toJSON() as APIButtonComponentWithCustomId).custom_id;
            }
            return comparingCustomId === customId;
          }
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
        collected: Collection<Snowflake, MessageActionRowComponentBuilder>,
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
    collected: Collection<Snowflake, MessageActionRowComponentBuilder>,
    reason: string,
    customCollector: this
  ) => Promise<void>;
}
