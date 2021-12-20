import {
  Collection,
  MessageComponentInteraction,
  Message,
  MessageActionRow,
  MessageActionRowComponent,
  MessageSelectMenu,
  Snowflake
} from "discord.js";
import EventEmitter from "events";
import { MessageOptions, sendMessage } from "./multiMessage";
import { v4 } from "uuid";

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
export class CustomCollector extends EventEmitter {
  readonly components: CustomCollectorComponent<MessageActionRowComponent>[] = [];
  private _currentRow: MessageActionRowComponent[] = [];
  readonly rows: MessageActionRow[] = [];
  readonly randomCustomIdPrefix: string;
  private _message: Message;

  constructor() {
    super();
    this.randomCustomIdPrefix = v4().replace(/-/g, "").toLowerCase();
  }

  get message(): Message {
    return this._message;
  }

  private compactIntoMessageActionRow() {
    this.rows.push(new MessageActionRow().addComponents(this._currentRow));
    this._currentRow = [];
  }

  private manipulateComponent(component: MessageActionRowComponent) {
    if (component.customId === null) {
      component.setCustomId(v4().replace(/-/g, "").toLowerCase());
    }
    component.setCustomId(this.randomCustomIdPrefix + "_" + component.customId);
  }

  addComponent(component: MessageActionRowComponent, onCollect: (data: CollectedComponent<MessageActionRowComponent>) => Promise<void>): this {
    if (this.components.length === 5 || component instanceof MessageSelectMenu) {
      this.compactIntoMessageActionRow();
    }
    this.manipulateComponent(component);
    this.components.push({
      component,
      collector: onCollect
    });
    return this;
  }

  addActionRow(row: MessageActionRow, onCollect: ((data: CollectedComponent<MessageActionRowComponent>) => Promise<void>)[]): this {
    const customCollectorComponents = row.components.map((value, index) => {
      this.manipulateComponent(value);
      return {
        component: value,
        collector: onCollect[index]
      };
    });
    this.rows.push(row);
    this.components.push(...customCollectorComponents);
    return this;
  }

  async send(options: MessageOptions, collectMs: number) {
    if (this._currentRow){
      this.compactIntoMessageActionRow();
    }
    const message = await sendMessage({
      components: this.rows,
      ...options
    }) as Message;
    this._message = message;
    const collector = await message.createMessageComponentCollector({
      time: collectMs,
      filter: (component) => component.customId.startsWith(this.randomCustomIdPrefix)
    });
    collector.on("collect", async (interaction: MessageComponentInteraction) => {
      if (this.onCollect) {
        await this.onCollect(interaction, this);
      }
      const customId = interaction.customId;
      const component = this.components.find((value) => value.component.customId === customId)!;
      await component.collector({
        component: component.component,
        interaction,
        collector: this
      });
    })
    collector.on("end", async (collected: Collection<Snowflake, MessageActionRowComponent>, reason: string) => {
      if (this.onEnd) {
        await this.onEnd(collected, reason, this);
      }
    });
  }

  onCollect?: (interaction: MessageComponentInteraction, customCollector: this) => Promise<void>;
  onEnd?: (collected: Collection<Snowflake, MessageActionRowComponent>, reason: string, customCollector: this) => Promise<void>;
}