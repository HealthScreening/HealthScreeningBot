// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.

const Sequelize = require("sequelize");
/**
 * Actions summary:
 *
 * addColumn "type" to table "ErrorLogs"
 * addIndex "error_logs_type" to table "ErrorLogs"
 *
 **/

let info = {
  revision: 7,
  name: "noname",
  created: "2021-12-12T20:45:48.211Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "addColumn",
    params: [
      "ErrorLogs",
      "type",
      {
        type: Sequelize.STRING,
        field: "type",
        allowNull: false,
      },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "ErrorLogs",
      ["type"],
      {
        indexName: "error_logs_type",
        name: "error_logs_type",
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
