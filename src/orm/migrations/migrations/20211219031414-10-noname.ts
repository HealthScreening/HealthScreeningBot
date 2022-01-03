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
// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.

/**
 * Actions summary:
 *
 * removeIndex "error_logs_github_issue_number" from table "ErrorLogs"
 * removeColumn "githubIssueNumber" from table "ErrorLogs"
 *
 **/

let info = {
  revision: 10,
  name: "noname",
  created: "2021-12-19T03:14:14.887Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "removeIndex",
    params: ["ErrorLogs", "error_logs_github_issue_number"],
  },
  {
    fn: "removeColumn",
    params: ["ErrorLogs", "githubIssueNumber"],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
