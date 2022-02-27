// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.

const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable "ErrorLogs", deps: []
 * addIndex "error_logs_github_issue_number" to table "ErrorLogs"
 * addIndex "error_logs_created_at" to table "ErrorLogs"
 *
 **/

let info = {
  revision: 5,
  name: "noname",
  created: "2021-12-12T18:16:14.279Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "createTable",
    params: [
      "ErrorLogs",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          autoIncrement: true,
        },
        errorName: {
          type: Sequelize.STRING,
          field: "errorName",
          allowNull: false,
        },
        errorDescription: {
          type: Sequelize.TEXT,
          field: "errorDescription",
          allowNull: true,
        },
        errorStack: {
          type: Sequelize.TEXT,
          field: "errorStack",
          allowNull: true,
        },
        githubIssueNumber: {
          type: Sequelize.INTEGER,
          field: "githubIssueNumber",
          allowNull: true,
        },
        metadata: {
          type: Sequelize.JSON,
          field: "metadata",
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
      },
      {},
    ],
  },
  {
    fn: "addIndex",
    params: [
      "ErrorLogs",
      ["githubIssueNumber"],
      {
        indexName: "error_logs_github_issue_number",
        name: "error_logs_github_issue_number",
      },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "ErrorLogs",
      ["createdAt"],
      {
        indexName: "error_logs_created_at",
        name: "error_logs_created_at",
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
