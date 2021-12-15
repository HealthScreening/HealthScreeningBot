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
 * changeColumn "metadata" on table "ErrorLogs"
 *
 **/

let info = {
  revision: 6,
  name: "noname",
  created: "2021-12-12T18:35:37.232Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "changeColumn",
    params: [
      "ErrorLogs",
      "metadata",
      {
        type: Sequelize.JSONB,
        field: "metadata",
        allowNull: true,
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
