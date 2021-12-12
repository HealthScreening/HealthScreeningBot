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
 * addColumn "type" to table "AutoUsers"
 *
 **/

let info = {
    "revision": 4,
    "name": "noname",
    "created": "2021-12-12T01:57:17.748Z",
    "comment": ""
};

let migrationCommands = [{
    fn: "addColumn",
    params: [
        "AutoUsers",
        "type",
        {
            "type": Sequelize.ENUM('G', 'S', 'E'),
            "field": "type",
            "defaultValue": "G",
            "allowNull": false
        }
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface)
    {
        let index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
