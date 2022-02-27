// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.
const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * removeColumn "id" from table "AutoUsers"
 * createTable "AutoDays", deps: []
 * changeColumn "userId" on table "AutoUsers"
 *
 **/

let info = {
  revision: 2,
  name: "noname",
  created: "2021-12-12T00:18:42.134Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "removeColumn",
    params: ["AutoUsers", "id"],
  },
  {
    fn: "createTable",
    params: [
      "AutoDays",
      {
        userId: {
          type: Sequelize.STRING,
          field: "userId",
          primaryKey: true,
        },
        onSunday: {
          type: Sequelize.BOOLEAN,
          field: "onSunday",
          defaultValue: false,
        },
        onMonday: {
          type: Sequelize.BOOLEAN,
          field: "onMonday",
          defaultValue: true,
        },
        onTuesday: {
          type: Sequelize.BOOLEAN,
          field: "onTuesday",
          defaultValue: true,
        },
        onWednesday: {
          type: Sequelize.BOOLEAN,
          field: "onWednesday",
          defaultValue: true,
        },
        onThursday: {
          type: Sequelize.BOOLEAN,
          field: "onThursday",
          defaultValue: true,
        },
        onFriday: {
          type: Sequelize.BOOLEAN,
          field: "onFriday",
          defaultValue: true,
        },
        onSaturday: {
          type: Sequelize.BOOLEAN,
          field: "onSaturday",
          defaultValue: false,
        },
      },
      {},
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "AutoUsers",
      "userId",
      {
        type: Sequelize.STRING,
        field: "userId",
        primaryKey: true,
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
