# InteractionMessageOptions

An interface representing the options for an interaction item type.

Parent Class: [`BaseMessageOptions`](base-message-options.md)

## Fields

### Inherited

* [`BaseMessageOptions.content`](base-message-options.md#content)
* [`BaseMessageOptions.embeds`](base-message-options.md#embeds)

### itemType

The type of item. Always will be [`ItemType.interaction`](item-type.md#interaction).

* Type: [`InteractionItem`](interaction-item.md)
* Required: Yes

### item

The item to send to.

* Type: [`CommandInteraction`](https://discord.js.org/#/docs/main/stable/class/CommandInteraction)
* Required: Yes

### followup

Whether to send the message as a reply or as a followup interaction. All interactions need to be replied to, but can
only be replied to once.

* Type: [`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
* Required: No
* Default: `false`

### ephemeral

Whether to send the message as an ephemeral message. An ephemeral message is a message that can only be seen by the user
who created the interaction, but also vanishes if the client is restarted.

* Type: [`boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
* Required: No
* Default: `false`