# UserMessageOptions

An interface representing the options for an user item type.

Parent Class: [`NonInteractionMessageOptions`](non-interaction-message-options)

## Fields

### Inherited

* [`BaseMessageOptions.content`](base-message-options#content)
* [`BaseMessageOptions.embeds`](base-message-options#embeds)
* [`NonInteractionMessageOptions.replyMessage`](non-interaction-message-options#replymessage)
* [`NonInteractionMessageOptions.failIfNotExists`](non-interaction-message-options#failifnotexists)

### itemType

The type of item. Always will be [`ItemType.user`](item-type#user).

* Type: [`UserItem`](user-item)
* Required: Yes

### item

The item to send to.

* Type: [`User`](https://discord.js.org/#/docs/main/stable/class/User)
* Required: Yes