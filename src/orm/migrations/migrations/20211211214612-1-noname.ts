/**
 * Copyright (C) 2021 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
/**
 * Actions summary:
 *
 * createTable "AutoUsers", deps: []
 *
 **/

import { DataTypes } from "sequelize";

const info = {
  "revision": 1,
  "name": "noname",
  "created": "2021-12-11T21:46:12.406Z",
  "comment": ""
};

const migrationCommands = [{
  fn: "createTable",
  params: [
    "AutoUsers",
    {
      "id": {
        "type": DataTypes.INTEGER,
        "field": "id",
        "autoIncrement": true,
        "primaryKey": true
      },
      "userId": {
        "type": DataTypes.INTEGER,
        "field": "userId",
        "unique": true,
        "allowNull": false
      },
      "firstName": {
        "type": DataTypes.STRING,
        "field": "firstName",
        "allowNull": false
      },
      "lastName": {
        "type": DataTypes.STRING,
        "field": "lastName",
        "allowNull": false
      },
      "email": {
        "type": DataTypes.STRING,
        "field": "email",
        "allowNull": false
      },
      "vaccinated": {
        "type": DataTypes.BOOLEAN,
        "field": "vaccinated",
        "defaultValue": true,
        "allowNull": false
      },
      "hour": {
        "type": DataTypes.SMALLINT,
        "field": "hour",
        "defaultValue": 5,
        "allowNull": false
      },
      "minute": {
        "type": DataTypes.SMALLINT,
        "field": "minute",
        "defaultValue": 40,
        "allowNull": false
      },
      "createdAt": {
        "type": DataTypes.DATE,
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
