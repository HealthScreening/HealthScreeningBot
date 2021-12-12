"use strict";

let Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable "AutoUsers", deps: []
 *
 **/

let info = {
  "revision": 1,
  "name": "noname",
  "created": "2021-12-11T21:46:12.406Z",
  "comment": ""
};

let migrationCommands = [{
  fn: "createTable",
  params: [
    "AutoUsers",
    {
      "id": {
        "type": Sequelize.INTEGER,
        "field": "id",
        "autoIncrement": true,
        "primaryKey": true
      },
      "userId": {
        "type": Sequelize.INTEGER,
        "field": "userId",
        "unique": true,
        "allowNull": false
      },
      "firstName": {
        "type": Sequelize.STRING,
        "field": "firstName",
        "allowNull": false
      },
      "lastName": {
        "type": Sequelize.STRING,
        "field": "lastName",
        "allowNull": false
      },
      "email": {
        "type": Sequelize.STRING,
        "field": "email",
        "allowNull": false
      },
      "vaccinated": {
        "type": Sequelize.BOOLEAN,
        "field": "vaccinated",
        "defaultValue": true,
        "allowNull": false
      },
      "hour": {
        "type": Sequelize.SMALLINT,
        "field": "hour",
        "defaultValue": 5,
        "allowNull": false
      },
      "minute": {
        "type": Sequelize.SMALLINT,
        "field": "minute",
        "defaultValue": 40,
        "allowNull": false
      },
      "createdAt": {
        "type": Sequelize.DATE,
        "field": "createdAt",
        "allowNull": false
      }
    },
    {}
  ]
}];

module.exports = {
  pos: 0,
  up: function(queryInterface) {
    let index = this.pos;
    return new Promise(function(resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log("[#" + index + "] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        }
        else {
          resolve(null);
        }
      }

      next();
    });
  },
  info: info
};
