__**Other Useful Screening-Related Commands**__:
`/set`: Sets additional information for the automated health screening.
Paremeters (All optional by the way):
- **device**: The name of the device for the health screening to "use". To view the full device list, do `/guide name:device_list`. *Note*: The device is used with `/generate_once` as well, so deleting your auto information will not completely reset your device. The default device used is `iPhone 11`.
- **hour**: The hour to run the health screening at. Should be a number in the range of 0-23. *Note*: Changing the hour does not set the minute to zero. The default hour is 5.
- **minute**: The minute to run the health screening at. Should be a number between 0 - 59.
Together, the hour and minute should represent the time you get your health screening at, such as 5:20, or 23:35 (11:35 PM)
- **type**: The type of screening to generate. Available options are __guest__, __student__, or __employee__. The default is __guest__.
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
