# /set_auto

The `/set_auto` command is the command that stores your information inside of the bot’s database for automatic
processing of health screenings. It can be used to **add** and **update** your information, as it will always overwrite
what is currently stored in the database. The command has 4 arguments. If successful, you will see a message from the
bot saying "Updated".

## Arguments

### first_name

This is the first name of the person whose name will be on the screening.

- Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- Required: Yes
- Example: "John"

### last_name

This is the last name of the person whose name will be on the screening.

- Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- Required: Yes
- Example: Doe

### email

This is the email of the person whose name will be on the screening.

- Type: [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- Required: Yes
- Format: `[a]@[b].[c]`
- Example: example@example.com

### vaccinated

This is the vaccination status of the person whose name will be on the screening.

- Type: [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)
- Required: Yes
- Example: True
