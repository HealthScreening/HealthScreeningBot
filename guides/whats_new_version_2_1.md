As promised when version 2.0 was released, the requested features have been implemented.

__**What's new in version 2.1?**__

* Customizable screening times
* Customizable screening days
* Email-only screenings

__**How to set these:**__

The `/set_auto` command will still handle the names, email and vaccination status. However, **everything else** will use the new `/set` command. All commands to this command are *optional*, so you can only change what you need.

__Desktop:__

To set any option, type `/set`, select the `/set` command, and then type the option you want. For example, for the `device` option I would select `/set` , type `device`, and then  hit Enter on my keyboard. Most options will give you a choice, while other options will require you to type something in. Once you finish typing a response to an option, hit Tab. You can then repeat with more options or hit enter to use the command.

__Mobile:__

All options are shown on a slider. To set any option, type `/set`, select the `/set` command, and then swipe left or right as needed until you find the option you are looking for, and then tap on it. Most options will give you a choice, while other options will require you to type something in. Once you finish typing a response to an option, either swipe and tap on the next option you want to provide, or send the message.

__**Options:**__

* `device`: The device to use.
* `hour`: The hour that the screening should run at. Use **24-hour time** (so 12 AM = 0, 11 PM = 23, etc.)
* `minute`: The minute that the screening should run at.
* `emailOnly`: Whether to only send an email for the screening. **This will not affect the `/generate_*` commands.**
* `paused`: Whether health screenings are paused. This will stop emails as well as screenshots. **This will not affect the `/generate_*` commands.**
* `type`: The type of screenshot to be provided (`student` or `guest`)
* `sunday`/`monday`/`tuesday`/`wednesay`/`thursday`/`friday`/`saturday`: Days to control the screening. Set to true to receive screenings on this day or false to not.

*If you want to read this message again, use the `/guide name:whats_new_version_2_1` command.*