import { DateTime } from "luxon";

import { ErrorLog } from "../orm/errorLog";

export default function formatErrorLogEntry(
  item: ErrorLog,
  redact: boolean
): string {
  let metadata = item.metadata || {};
  if (redact) {
    metadata = {
      redacted: true,
    };
  }

  return `# Error Details
- Error ID: **${item.id}**
- Error Type: **${item.type}**
- Error Name: **${item.errorName}**
- Error Message: **${item.errorDescription || "None"}**
- Error Occured At: **${DateTime.fromMillis(item.createdAt.getTime())
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**

## Error Stack Trace

\`\`\`
${item.errorStack || "None"}
\`\`\`

## Error Metadata

\`\`\`json
${JSON.stringify(metadata, null, 4)}
\`\`\`

# Issue Details
- Posted By: **@PythonCoderAS**
- Posted At: **${DateTime.local()
    .setZone("America/New_York")
    .toLocaleString(DateTime.DATETIME_HUGE_WITH_SECONDS)}**`;
}
