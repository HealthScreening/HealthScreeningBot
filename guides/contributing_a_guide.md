All guides go inside the `guides` directory located at the root of the project. All guides are markdown files, and must end with a `.md` extension.

Discord's embed description character limit is 4096 characters. This means that each page of a guide can only have a maximum of 4096 characters.

If the guide you want to submit goes over this page limit, you can split it into multiple pages. You can do this by making multiple files, and suffixing each page with `page_<num>` before the extension, where `<num>` is the page number.

Make sure to update the guides list at `guides.md` when adding a new guide in. The guide list format is as follows:

```md
* **Guide Title**: `/guide name:<name>`, where `<name>` is the name of the guide in the guide Collection.
```

If you know how to code, you can add an entry for the guide by adding a new key and data to `src/client/extraClient.ts`. However, if you do not know how to code, just mention that and I will add the appropriate code entry in for you. When adding a new item to the object, it has to be of this form:

```ts
shortcode: {
  title: "Title With Spaces",
  files: ["file1.md", "file2.md", ...],
},
```

The shortcode can only contain characters, numbers and underscores. Each file corresponds to one page of the guide. An example of a valid entry is: 

```ts
server_rules: {
  title: "Server Rules",
  files: [getGuidePath("server_rules")],
},
```

You can also see this at https://github.com/HealthScreening/HealthScreeningBot/blob/8397cbb5e8dc9e4e82692eb8dfe908f4c674060e/src/client/extraClient.ts#L125-L128.