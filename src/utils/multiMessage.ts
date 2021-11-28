import {Embed} from "@discordjs/builders";
import {APIMessage} from "discord-api-types";
import {CommandInteraction, Message, User} from "discord.js";


/**
 * The type of a given item. This is used in favor of comparing the output of typeof because
 * it is more reliable, as it will continue working even if the underlying type name changes.
 *
 * @enum {number}
 */
export enum ItemType {
    interaction,
    user,
    message
}

/**
 * Options that are shared by all target types.
 * At least one of {@link BaseMessageOptions.content} or {@link BaseMessageOptions.embeds} must be provided.
 */
interface BaseMessageOptions {
    /**
     * The text to send.
     */
    content?: string
    /**
     * The embeds to send.
     */
    embeds?: Embed[]
}

/**
 * Options that are shared by all non-interaction target types.
 * @extends {BaseMessageOptions}
 */
interface NonInteractionMessageOptions extends BaseMessageOptions {
    /**
     * A message to reply to.
     */
    replyMessage?: Message
    /**
     * Whether or not to send the message if the message being replied to is deleted.
     *
     * If {@link NonInteractionMessageOptions.replyMessage} is not provided, this will be ignored.
     */
    failIfNotExists?: boolean;
}

/**
 * Options that are used by interaction target types.
 * @extends {BaseMessageOptions}
 */
export interface InteractionMessageOptions extends BaseMessageOptions {
    itemType: ItemType.interaction
    item: CommandInteraction
    /**
     * Whether to send the message as a followup message or a reply message.
     *
     * All interactions must be replied to, but can only be replied to once.
     */
    followup?: boolean
    /**
     * Whether to send the message as an ephemeral message. An ephemeral message is a message that can only be seen by
     * the user who created the interaction, but also vanishes if the client is restarted.
     */
    ephemeral?: boolean
}

/**
 * Options that are used by user target types.
 * @extends {NonInteractionMessageOptions}
 */
export interface UserMessageOptions extends NonInteractionMessageOptions {
    itemType: ItemType.user
    item: User
}

/**
 * Options that are used by message target types.
 * @extends {NonInteractionMessageOptions}
 */
export interface MessageMessageOptions extends NonInteractionMessageOptions {
    itemType: ItemType.message
    item: Message
}

/**
 * A union type consisting of all possible message options.
 */
export type MessageOptions = InteractionMessageOptions | UserMessageOptions | MessageMessageOptions;

/**
 * The default options for fields in {@link MessageOptions} that are optional boolean fields.
 */
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
 *   <li>If the {@link MessageOptions.itemType} is {@link ItemType.interaction}, the message will be replied to the
 *   interaction. In that case, `options` will be of type {@link InteractionMessageOptions}. In addition,
 *     <ul>
 *       <li>If the {@link InteractionMessageOptions.followup} is `true`, the return type will be the message sent.</li>
 *       <li>If the {@link InteractionMessageOptions.followup} is `false`, the return type will be `void`.</li>
 *     </ul>
 *   </li>
 *   <li>If the {@link MessageOptions.itemType} is {@link ItemType.user}, the message will be sent to the user's DM channel.
 *   In that case, `options` will be of type {@link UserMessageOptions}.</li>
 *   <li>If the {@link MessageOptions.itemType} is {@link ItemType.message}, the message will be sent to the channel the message
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