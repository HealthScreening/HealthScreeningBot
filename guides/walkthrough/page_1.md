**This is the complete walkthrough of the commands of the Health Screening Bot.**

This bot is fairly simple and self-explanatory, but this guide serves as an complete walkthrough of the commands.
`Highlighted text` is a command name.
- dashed text are command arguments.

`/set_auto`: Sets the information used for the automated health screening.
__Parameters__:
- **first_name**: Your first name.
- **last_name**: Your last name.
- **email**: Your email. (If you do not want to get emails from the bot, just set it to a fake email.)
- **vaccinated**: Whether you are vaccinated. This should be either __True__ or __False__.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.

`/generate_auto`: Generate a health screening using the information set with `/set_auto`.
__Parameters__:
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.
