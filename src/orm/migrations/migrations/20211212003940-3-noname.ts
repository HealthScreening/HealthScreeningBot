// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.
const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable "Devices", deps: []
 *
 **/

let info = {
  revision: 3,
  name: "noname",
  created: "2021-12-12T00:39:40.818Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "createTable",
    params: [
      "Devices",
      {
        userId: {
          type: Sequelize.STRING,
          field: "userId",
          primaryKey: true,
        },
        device: {
          type: Sequelize.STRING,
          field: "device",
          defaultValue: "iPhone 11",
          allowNull: false,
        },
      },
      {},
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
