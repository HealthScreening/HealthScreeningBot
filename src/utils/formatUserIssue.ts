import { User } from "discord.js";
import { DateTime } from "luxon";

export default function formatUserIssue(message: string, user: User, type: string = "Suggestion"){
  return `
## ${type} Message

${message.split("\n").map((line) => "> " + line).join("\n")}

## ${type} Metadata
Bug Reported By: **${user.username}#${user.discriminator}** (\`${user.id}\`)
Bug Reported At: **${DateTime.local()
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**
`
}