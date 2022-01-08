If you want to make a correction to an existing guide, you can submit a PR containing a modification to the guide files. If you want to submit a new guide, please read the following:

All guides go inside the `guides` directory located at the root of the project. All guides are markdown files, and must end with a `.md` extension.

Discord's embed description character limit is 4096 characters. This means that each page of a guide can only have a maximum of 4096 characters.

If the guide you want to submit goes over this page limit, you can split it into multiple pages. You can do this by making multiple files, and suffixing each page with `page_<num>` before the extension, where `<num>` is the page number.

Make sure to update the guides list at `guides.md` when adding a new guide in. There is a script that automatically updates the guides list. It can be called with `npm run build && node scripts/generateGuides.js`. If you cannot run this yourself, mention it in the PR and a contributor will do it for you.

If you prefer to do it manually, you can add the entry in `guides/guides.md`. Please keep the list sorted in alphabetical order based on the guide title.

```md
* **Guide Title**: `/guide name:<name>`
```

`<name>` is the name of the guide in the guide Collection.

When you submit a guide, you need to provide the following:

- One or more files representing the pages of the guide.
- A short title, which will be used in the guide list.
- A title or list of titles for the pages of the guide. If one title is provided, it will be used for every page in the guide. Otherwise, you need to provide one title per page of the guide.