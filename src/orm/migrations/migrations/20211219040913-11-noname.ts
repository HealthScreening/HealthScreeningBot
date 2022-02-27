// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.
const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn "emailOnly" to table "AutoUsers"
 * addColumn "paused" to table "AutoUsers"
 * addIndex "auto_users_paused" to table "AutoUsers"
 *
 **/

let info = {
  revision: 11,
  name: "noname",
  created: "2021-12-19T04:09:13.669Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "addColumn",
    params: [
      "AutoUsers",
      "emailOnly",
      {
        type: Sequelize.BOOLEAN,
        field: "emailOnly",
        defaultValue: false,
        allowNull: false,
      },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "AutoUsers",
      "paused",
      {
        type: Sequelize.BOOLEAN,
        field: "paused",
        defaultValue: false,
        allowNull: false,
      },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "AutoUsers",
      ["paused"],
      {
        indexName: "auto_users_paused",
        name: "auto_users_paused",
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
