`/set`: Sets additional information for the automated health screening. If parameters are omitted, the interactive set menu will be sent instead. The interactive menu is a little more limited than the `/set`  command but should handle most cases.
__Parameters__ (All optional by the way):
- **device**: The name of the device for the health screening to "use". To view the full device list, do `/guide name:device_list`. *Note*: The device is used with `/generate_once` as well, so deleting your auto information will not completely reset your device. The default device used is `iPhone 11`.
- **hour**: The hour to run the health screening at. Should be a number in the range of 0-23. *Note*: Changing the hour does not set the minute to zero. The default hour is 5.
- **minute**: The minute to run the health screening at. Should be a number between 0 - 59.
Together, the hour and minute should represent the time you get your health screening at, such as 5:20, or 23:35 (11:35 PM)
- **type**: The type of screening to generate. Available options are __guest__, __student__, or __employee__. The default is __guest__.
- **email_only**: Whether the health screening should be only emailed or emailed and screenshotted. If this is __True__, the bot will **not** automatically DM you the health screening on Discord. This should be either __True__ or __False__. The default is __False__. The `/generate_auto` command will produce a screenshot regardless of what this is set to.
- **paused**: Whether to pause the auto health screenings. If this is True, you will **not** receive any automated screenings, including emails. This should be either __True__ or __False__. The default is __False__.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.
*Note*: The following arguments represent whether to run the health screening on the specified day. This should be either __True__ or __False__. If __False__, you will **not** receive any automated screenings on that day.
- **sunday**: Defaults to __False__.
- **monday**: Defaults to __True__.
- **tuesday**: Defaults to __True__.
- **wednesday**: Defaults to __True__.
- **thursday**: Defaults to __True__.
- **friday**: Defaults to __True__.
- **saturday**: Defaults to __False__.

`/reset`: Resets anything changed with `/set` back to the defaults, **including the device**.

`/generate_once`: Generate a singular health screening without using your information set with `/set_auto`. If set, the device **will** be considered.
__Parameters__:
- **first_name**: Your first name.
- **last_name**: Your last name.
- **email**: Your email.
- **vaccinated**: Whether you are vaccinated. This should be either __True__ or __False__.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.

`/delete_auto`: Deletes all stored auto information, excluding the device. 

`/test_screening`: Shows whether you will be receiving a health screening and whether or not you will be getting it via email only or an email and a screenshot on a given day. If used with no arguments, it will default to the day it is run. If a screening will not be delivered, or a screenshot will not be sent, it will state the reason why.
__Parameters__:
- **year**: The year of the date to check. Optional, and defaults to the year the command is run.
- **month**: The month of the date to check. Optional, and defaults to the month the command is run.
- **day**: The day of the date to check. Optional, and defaults to the day the command is run.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.