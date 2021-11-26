# sendMessage(options)

Sends a message using the specified options. The function currently supports sending to three different types of items:

* [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction)s
* [Message](https://discord.js.org/#/docs/main/stable/class/Message)s
* [User](https://discord.js.org/#/docs/main/stable/class/User)s

## Parameters

### options

An object representing the arguments to the function.

* Type:

## Returns

When [`options.item`](send-message-options#item) is either
a [Message](https://discord.js.org/#/docs/main/stable/class/Message) or
a [User](https://discord.js.org/#/docs/main/stable/class/User), it will always return the message that is sent.
When [`options.item`](send-message-options#item) is
a [CommandInteraction](https://discord.js.org/#/docs/main/stable/class/CommandInteraction), depending on the value
of [`options.followup`](send-message-options#followup):

* If [`options.followup`](send-message-options#followup) is `true`, the message that is sent will be returned.
* If [`options.followup`](send-message-options#followup) is `false`, nothing will be returned.