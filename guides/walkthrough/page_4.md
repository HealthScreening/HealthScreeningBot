`/guide`: Sends a guide from a list of approved guides. Guides can be contributed by anyone to the bot's GitHub repository.
__Parameters__:
- **name**: The name of the guide to send.
- **paginate**: Whether to paginate the guide. This is an optional argument and should be either __True__ or __False__. The default is __True__. Note: One-page guides will not have any paginator buttons regardless of the value provided to this argument.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.

`/profile`: Shows an overview of all information stored for the user, including information submitted via `/set_auto` and `/set`.
__Parameters__:
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.

`/report_bug`: Reports a bug to the bot's GitHub repository.
__Parameters__:
- **message**: The bug report message.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.

`/stats`: Send bot stats. This does not have the ephemeral argument (why would it?)

`/suggest`: Suggests a feature to the bot's GitHub repository.
__Parameters__:
- **message**: The suggestion message.
- **server**: Whether the suggestion is a server suggestion (__True__) or a bot suggestion (__False__). This is optional and should be either __True__ or __False__. This defaults to __False__.
- **ephemeral**: Whether to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.