`/generate_once`: Generate a singular health screening without using your information set with `/set_auto`. If set, the device **will** be considered.
__Parameters__:
- **first_name**: Your first name.
- **last_name**: Your last name.
- **email**: Your email.
- **vaccinated**: Whether you are vaccinated. This should be either __True__ or __False__.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.

`/delete_auto`: Deletes all stored auto information, excluding the device.

`/test_screening`: Shows whether you will be receiving a health screening and whether you will be getting it via email only or an email and a screenshot on a given day. If used with no arguments, it will default to the day it is run. If a screening will not be delivered, or a screenshot will not be sent, it will state the reason why.
__Parameters__:
- **year**: The year of the date to check. Optional, and defaults to the year the command is run.
- **month**: The month of the date to check. Optional, and defaults to the month the command is run.
- **day**: The day of the date to check. Optional, and defaults to the day the command is run.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.