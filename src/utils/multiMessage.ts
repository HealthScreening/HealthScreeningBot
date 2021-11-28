import {Embed} from "@discordjs/builders";
import {APIMessage} from "discord-api-types";
import {CommandInteraction, Message, User} from "discord.js";

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
export function sendMessage(options: InteractionMessageOptions & { followup: true }): Promise<Message | APIMessage>;
export function sendMessage(options: InteractionMessageOptions): Promise<void>;
/**
 * Sends a message to a user, channel, or interaction.
 *
 * @param {MessageOptions} options The options for the message.
 * <ul>
 *   <li>If the {@link MessageOptions.itemType} is {@link InteractionItem}, the message will be replied to the
 *   interaction. In that case, `options` will be of type {@link InteractionMessageOptions}. In addition,
 *     <ul>
 *       <li>If the {@link InteractionMessageOptions.followup} is `true`, the return type will be the message sent.</li>
 *       <li>If the {@link InteractionMessageOptions.followup} is `false`, the return type will be `void`.</li>
 *     </ul>
 *   </li>
 *   <li>If the {@link MessageOptions.itemType} is {@link UserItem}, the message will be sent to the user's DM channel.
 *   In that case, `options` will be of type {@link UserMessageOptions}.</li>
 *   <li>If the {@link MessageOptions.itemType} is {@link MessageItem}, the message will be sent to the channel the message
 *   was sent in. In that case, `options` will be of type {@link MessageMessageOptions}.</li>
 * </ul>
 *
 */
export function sendMessage(options: MessageOptions) {
    const trueOptions: MessageOptions = {...defaultOptions, ...options};
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