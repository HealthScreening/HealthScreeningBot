**Miscellaneous**
*Note* All commands in this category have an ephemeral argument, which hides the content sent from everyone else if True. This argument will not be listed in these parameters.
`/guide`: Sends a guide from a list of approved guides. Guides can be contributed by anyone to the bot's GitHub repository.
Paremeters: 
- **name**: The name of the guide to send.
- **paginate**: Whether to paginate the guide. This is an optional argument and should be either __True__ or __False__. The default is __True__. Note: One-page guides will not have any paginator buttons regardless of the value provided to this argument.
- **ephemeral**: Whether or not to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.

`/profile`: Shows an overview of all information stored for the user, including information submitted via `/set_auto` and `/set`.
- **ephemeral**: Whether or not to hide the content from everyone else. This is optional and should be either __True__ or __False__. This defaults to __True__.

`/stats` : Send bot stats. This does not have the ephemeral argument (why would it?)
