# ItemType

This enum represents the type of the given item. This is used in favor of comparing the output of `typeof` because it is
more reliable, as it will continue working even if the underlying type name changes.

## Values

### interaction

A value showing that the item is an interaction.

### user

A value showing that the item is a user.

### message

A value showing that the item is a message.