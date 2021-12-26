**This is the complete walkthrough of the commands of the HealthScreening Bot.**
This bot is fairly simple and self-explanatory, but this guide serves as an complete walkthrough of the commands.
`highlighted text` is a command name
- dashed text are command arguments!


**Automated Health Screening Commands:**
`set_auto` : Sets the information used for the automated health screening
Paremeters:
- first_name : Your first name
- last_name : Your last name
- email : Your email 
- vaccinated : Whether or not you are vaccinated. This should be either __True__ or __False__
- ephemeral : Whether or not to hide the content from everyone else. This is optional and should be either __True__ or __False__


`generate_auto` : Generate an health screening using your information set with `set_auto`.
Paremeters:
- ephemeral : Whether or not to hide the content from everyone else. This is optional and should be either __True__ or __False__


`set` : Sets additional information for the automated health screening.
Paremeters (All optional by the way):
- device: The name of the device for the health screening to "use". To view the full device list, do `/guide name:device_list`.
- hour : The hour to run the health screening at. Number should be in between 0 - 23.
- minute : The minute to run the health screening at. Number  should be in between 0 - 59.
*Note*: Together, the hour and time should represent the time you get your health screening at, such as 5:20, or 23:35 (or 11:35 PM)
- type : The type of screening to generate. Available options are __guest__, __student__, or __employee__, but defaults to __guest__.
- email_only : Whether the health screening should be emailed only or not. If this is True, the bot will **not** DM you the health screening on Discord. This should be either __True__ or __False__, but defaults to False.
- paused : Whether to pause the auto health screenings. If this is True, you will **not** receive any automated screenings. This should be either __True__ or __False__, but defaults to False.
*Note*: The following arguments represent whether to run the health screening on the specified day. This should be either __True__ or __False__. If False, you will **not** receive any automated screenings on that day.
- sunday - monday - tuesday - wednesday - thursday - friday - saturday


`generate_once` : Generate a singular health screening without using your information set with `set_auto`.
Parameters:
- first_name : Your first name
- last_name : Your last name
- email : Your email 
- vaccinated : Whether or not you are vaccinated. This should be either __True__ or __False__
- ephemeral : Whether or not to hide the content from everyone else. This is optional and should be either __True__ or __False__


**Miscellaneous**
*Note* All commands in this category have an ephemeral argument, which hides the content sent from everyone else if True. This argument will not be listed in these parameters.
`guide`: Sends guides from the bot's github.
Paremeters: 
- name : Name of the guide to send
- paginate : Whether to paginate the guide. This is an optional argument.


`profile` : Sends the information set with the `set` command.


`stats` : Send bot stats. This does not have the ephemeral argument (why would it?)
