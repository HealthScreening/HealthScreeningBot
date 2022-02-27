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
