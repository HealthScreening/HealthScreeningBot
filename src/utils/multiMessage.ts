import { Embed } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { CommandInteraction, HTTPAttachmentData, Message, User } from "discord.js";

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
    files?: HTTPAttachmentData[]
    replyMessage?: Message
    failIfNotExists?: boolean;
    ephemeral?: boolean
}
export interface InteractionMessageOptions extends BaseMessageOptions {
    itemType: InteractionItem
    item: CommandInteraction

}

export interface UserMessageOptions extends BaseMessageOptions {
    itemType: UserItem
    item: User
}

export interface MessageMessageOptions extends BaseMessageOptions {
    itemType: MessageItem
    item: Message
}

export type MessageOptions = InteractionMessageOptions | UserMessageOptions | MessageMessageOptions;

const defaultOptions = {
    ephemeral: false,
    failIfNotExists: false,
    files: []
};

export function sendMessage(options: MessageOptions): Promise<Message|APIMessage> {
    const trueOptions: MessageOptions = { ...defaultOptions, ...options };
    switch (trueOptions.itemType) {
        case ItemType.user:
            return trueOptions.item.send({
                content: trueOptions.content,
                embeds: trueOptions.embeds,
                reply: {
                    messageReference: trueOptions.replyMessage,
                    failIfNotExists: trueOptions.failIfNotExists
                },
                files: trueOptions.files
            });
        case ItemType.message:
            return trueOptions.item.channel.send({
                content: trueOptions.content,
                embeds: trueOptions.embeds,
                reply: {
                    messageReference: trueOptions.replyMessage,
                    failIfNotExists: trueOptions.failIfNotExists
                },
                files: trueOptions.files
            });
        case ItemType.interaction:
            if (trueOptions.item.deferred || trueOptions.item.replied) {
                return trueOptions.item.followUp({
                    content: trueOptions.content,
                    embeds: trueOptions.embeds,
                    ephemeral: trueOptions.ephemeral,
                    files: trueOptions.files
                });
            } else {
                return trueOptions.item.reply({
                    content: trueOptions.content,
                    embeds: trueOptions.embeds,
                    ephemeral: trueOptions.ephemeral,
                    files: trueOptions.files,
                    fetchReply: true
                });
            }
    }
}