/**
 * Copyright (C) 2021-2022 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
