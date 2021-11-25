import { Embed } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { CommandInteraction, Message, User } from "discord.js";

export enum ItemType {
    interaction,
    user,
    message
}

export type InteractionItem = ItemType.interaction;
export type UserItem = ItemType.user;
export type MessageItem = ItemType.message;

interface BaseMessageOptions {
    content?: string
    embeds?: Embed[]
}

interface NonInteractionMessageOptions extends BaseMessageOptions {
    replyMessage?: Message
    failIfNotExists?: boolean;
}

export interface InteractionMessageOptions extends BaseMessageOptions {
    itemType: InteractionItem
    item: CommandInteraction
    followup?: boolean
    ephemeral?: boolean
}

export interface UserMessageOptions extends NonInteractionMessageOptions {
    itemType: UserItem
    item: User
}

export interface MessageMessageOptions extends NonInteractionMessageOptions {
    itemType: MessageItem
    item: Message
}

export type MessageOptions = InteractionMessageOptions | UserMessageOptions | MessageMessageOptions;

const defaultOptions = {
    followup: false,
    ephemeral: false,
    failIfNotExists: false
};


export function sendMessage(options: NonInteractionMessageOptions): Promise<Message>;
export function sendMessage(options: InteractionMessageOptions): Promise<Message | void | APIMessage>;
export function sendMessage(options) {
    const trueOptions: MessageOptions = { ...defaultOptions, ...options };
    switch (trueOptions.itemType) {
        case ItemType.user:
            return trueOptions.item.send({
                content: trueOptions.content,
                embeds: trueOptions.embeds,
                reply: {
                    messageReference: trueOptions.replyMessage,
                    failIfNotExists: trueOptions.failIfNotExists
                }
            });
        case ItemType.message:
            return trueOptions.item.channel.send({
                content: trueOptions.content,
                embeds: trueOptions.embeds,
                reply: {
                    messageReference: trueOptions.replyMessage,
                    failIfNotExists: trueOptions.failIfNotExists
                }
            });
        case ItemType.interaction:
            if (trueOptions.followup) {
                return trueOptions.item.reply({
                    content: trueOptions.content,
                    embeds: trueOptions.embeds,
                    ephemeral: trueOptions.ephemeral
                });
            } else {
                return trueOptions.item.followUp({
                    content: trueOptions.content,
                    embeds: trueOptions.embeds,
                    ephemeral: trueOptions.ephemeral
                });
            }
    }
}