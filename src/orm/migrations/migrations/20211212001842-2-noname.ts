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

import { DataTypes } from "sequelize";

/**
 * Actions summary:
 *
 * removeColumn "id" from table "AutoUsers"
 * createTable "AutoDays", deps: []
 * changeColumn "userId" on table "AutoUsers"
 *
 **/

let info = {
    "revision": 2,
    "name": "noname",
    "created": "2021-12-12T00:18:42.134Z",
    "comment": ""
};

let migrationCommands = [{
        fn: "removeColumn",
        params: ["AutoUsers", "id"]
    },
    {
        fn: "createTable",
        params: [
            "AutoDays",
            {
                "userId": {
                    "type": DataTypes.STRING,
                    "field": "userId",
                    "primaryKey": true
                },
                "onSunday": {
                    "type": DataTypes.BOOLEAN,
                    "field": "onSunday",
                    "defaultValue": false
                },
                "onMonday": {
                    "type": DataTypes.BOOLEAN,
                    "field": "onMonday",
                    "defaultValue": true
                },
                "onTuesday": {
                    "type": DataTypes.BOOLEAN,
                    "field": "onTuesday",
                    "defaultValue": true
                },
                "onWednesday": {
                    "type": DataTypes.BOOLEAN,
                    "field": "onWednesday",
                    "defaultValue": true
                },
                "onThursday": {
                    "type": DataTypes.BOOLEAN,
                    "field": "onThursday",
                    "defaultValue": true
                },
                "onFriday": {
                    "type": DataTypes.BOOLEAN,
                    "field": "onFriday",
                    "defaultValue": true
                },
                "onSaturday": {
                    "type": DataTypes.BOOLEAN,
                    "field": "onSaturday",
                    "defaultValue": false
                }
            },
            {}
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "AutoUsers",
            "userId",
            {
                "type": DataTypes.STRING,
                "field": "userId",
                "primaryKey": true
            }
        ]
    }
];

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
                    resolve(null);
            }
            next();
        });
    },
    info: info
};
