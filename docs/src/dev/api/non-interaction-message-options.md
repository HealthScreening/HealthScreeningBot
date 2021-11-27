# NonInteractionMessageOptions

An interface representing the options for any item type that is not an interaction.

Parent Class: [`BaseMessageOptions`](base-message-options)

## Fields

### Inherited

* [`BaseMessageOptions.content`](base-message-options#content)
* [`BaseMessageOptions.embeds`](base-message-options#embeds)

### replyMessage

A message to reply to when sending the message. 

* Type: [`Message`](https://discord.js.org/#/docs/main/stable/class/Message)
* Required: No

### failIfNotExists

Whether to fail if the message being replied to in [`replyMessage`](#replymessage) does not exist.

* Type: [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
* Required: No
* Default: `false`