# multiMessage.ts

This module contains a function to make it easy to send messages to one of multiple possible targets without having to
write boilerplate code.

## Enums

* [`ItemType`](../../item-type): The type of the item that is being sent.

## Functions

* [`sendMessage(options)`](../../send-message): Send a message to one of multiple possible targets.

## Interfaces

* [`BaseMessageOptions`](../../base-message-options): The base options for messages sent to any target.
* [`InteractionMessageOptions`](../../interaction-message-options): The options for messages sent to interaction
  targets.
* [`MessageMessageOptions`](../../message-message-options): The options for messages sent to message targets.
* [`NonInteractionMessageOptions`](../../non-interaction-message-options): The options for messages sent to
  non-interaction targets.
* [`UserMessageOptions`](../../user-message-options): The options for messages sent to user targets.

## Type Aliases

* [`InteractionItem`](../../interaction-item): A type indicating that the item enclosed is an Interaction.
* [`MessageItem`](../../message-item): A type indicating that the item enclosed is a Message.
* [`SendMessageOptions`](../../send-message-options): A type indicating the valid values for the options parameter
  of [`sendMessage()`](../../send-message).
* [`UserItem`](../../user-item): A type indicating that the item enclosed is a User.