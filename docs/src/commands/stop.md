# /stop

::: danger
This is a dangerous command that will immediately stop the bot. If any screenings were in progress, they will be stopped.
:::

::: warning
This command is only available to the bot owner. Anyone else will receive an error.
:::

Stops the bot. This is required in order to correctly stop and restart the bot, since systemd is unable to stop the
Chromium process by itself.

## Arguments

_There are no arguments for this command._