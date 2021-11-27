# MessageMessageOptions

An interface representing the options for a message item type.

Parent Class: [`NonInteractionMessageOptions`](non-interaction-message-options.md)

## Fields

### Inherited

* [`BaseMessageOptions.content`](base-message-options.md#content)
* [`BaseMessageOptions.embeds`](base-message-options.md#embeds)
* [`NonInteractionMessageOptions.replyMessage`](non-interaction-message-options.md#replymessage)
* [`NonInteractionMessageOptions.failIfNotExists`](non-interaction-message-options.md#failifnotexists)

### itemType

The type of item. Always will be [`ItemType.message`](item-type.md#message).

* Type: [`MessageItem`](message-item.md)
* Required: Yes

### item

The item to send to.

* Type: [`Message`](https://discord.js.org/#/docs/main/stable/class/Message)
* Required: Yes