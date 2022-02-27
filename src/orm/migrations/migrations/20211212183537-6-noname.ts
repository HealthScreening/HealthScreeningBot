// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.

const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * changeColumn "metadata" on table "ErrorLogs"
 *
 **/

let info = {
  revision: 6,
  name: "noname",
  created: "2021-12-12T18:35:37.232Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "changeColumn",
    params: [
      "ErrorLogs",
      "metadata",
      {
        type: Sequelize.JSONB,
        field: "metadata",
        allowNull: true,
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
