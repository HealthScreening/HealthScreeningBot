/**
 * Copyright (C) 2021-2022 PythonCoderAS
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
 * changeColumn "onSunday" on table "AutoDays"
 * changeColumn "onMonday" on table "AutoDays"
 * changeColumn "onTuesday" on table "AutoDays"
 * changeColumn "onWednesday" on table "AutoDays"
 * changeColumn "onThursday" on table "AutoDays"
 * changeColumn "onFriday" on table "AutoDays"
 * changeColumn "onSaturday" on table "AutoDays"
 *
 **/

let info = {
  revision: 8,
  name: "noname",
  created: "2021-12-17T02:55:45.620Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "changeColumn",
    params: [
      "AutoDays",
      "onSunday",
      {
        type: Sequelize.BOOLEAN,
        field: "onSunday",
        defaultValue: false,
        allowNull: false,
      },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "AutoDays",
      "onMonday",
      {
        type: Sequelize.BOOLEAN,
        field: "onMonday",
        defaultValue: true,
        allowNull: false,
      },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "AutoDays",
      "onTuesday",
      {
        type: Sequelize.BOOLEAN,
        field: "onTuesday",
        defaultValue: true,
        allowNull: false,
      },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "AutoDays",
      "onWednesday",
      {
        type: Sequelize.BOOLEAN,
        field: "onWednesday",
        defaultValue: true,
        allowNull: false,
      },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "AutoDays",
      "onThursday",
      {
        type: Sequelize.BOOLEAN,
        field: "onThursday",
        defaultValue: true,
        allowNull: false,
      },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "AutoDays",
      "onFriday",
      {
        type: Sequelize.BOOLEAN,
        field: "onFriday",
        defaultValue: true,
        allowNull: false,
      },
    ],
  },
  {
    fn: "changeColumn",
    params: [
      "AutoDays",
      "onSaturday",
      {
        type: Sequelize.BOOLEAN,
        field: "onSaturday",
        defaultValue: false,
        allowNull: false,
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
