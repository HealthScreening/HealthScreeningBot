// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.
const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable "CommandLogs", deps: []
 * addIndex "command_logs_user_i_d" to table "CommandLogs"
 * addIndex "command_logs_command_name" to table "CommandLogs"
 *
 **/

let info = {
  revision: 12,
  name: "noname",
  created: "2021-12-28T18:40:35.358Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "createTable",
    params: [
      "CommandLogs",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          autoIncrement: true,
        },
        userId: {
          type: Sequelize.STRING,
          field: "userId",
          allowNull: false,
        },
        commandName: {
          type: Sequelize.STRING,
          field: "commandName",
          allowNull: false,
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
      "CommandLogs",
      ["userId"],
      {
        indexName: "command_logs_user_i_d",
        name: "command_logs_user_i_d",
      },
    ],
  },
  {
    fn: "addIndex",
    params: [
      "CommandLogs",
      ["commandName"],
      {
        indexName: "command_logs_command_name",
        name: "command_logs_command_name",
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
