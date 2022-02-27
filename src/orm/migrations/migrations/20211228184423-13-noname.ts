// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.
const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn "userName" to table "CommandLogs"
 *
 **/

let info = {
  revision: 13,
  name: "noname",
  created: "2021-12-28T18:44:23.155Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "addColumn",
    params: [
      "CommandLogs",
      "userName",
      {
        type: Sequelize.STRING,
        field: "userName",
        allowNull: false,
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
