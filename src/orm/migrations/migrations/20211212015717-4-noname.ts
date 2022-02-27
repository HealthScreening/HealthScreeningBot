// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.

const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn "type" to table "AutoUsers"
 *
 **/

let info = {
  revision: 4,
  name: "noname",
  created: "2021-12-12T01:57:17.748Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "addColumn",
    params: [
      "AutoUsers",
      "type",
      {
        type: Sequelize.ENUM("G", "S", "E"),
        field: "type",
        defaultValue: "G",
        allowNull: false,
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
