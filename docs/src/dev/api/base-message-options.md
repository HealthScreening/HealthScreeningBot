# BaseMessageOptions

This interface shows fields that are used in every possible variant of [`SendMessageOptions`](send-message-options).

## Fields

### content

The content to send in the message.

* Type: [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
* Required: No

::: warning
At least one of [`content`](#content) or [`embeds`](#embeds) must be specified.
:::

### embeds

The embeds to send in the message.

* Type: [`Embed[]`](https://discord.js.org/#/docs/builders/stable/class/Embed)
* Required: No

::: warning
At least one of [`content`](#content) or [`embeds`](#embeds) must be specified.
:::