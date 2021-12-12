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
// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.
const Sequelize = require("sequelize");
/**
 * Actions summary:
 *
 * createTable "AutoUsers", deps: []
 *
 **/

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

module.exports = require("../makeMigrationExport")(info, migrationCommands);