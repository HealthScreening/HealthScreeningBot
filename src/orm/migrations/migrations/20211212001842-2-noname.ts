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
                    "type": Sequelize.STRING,
                    "field": "userId",
                    "primaryKey": true
                },
                "onSunday": {
                    "type": Sequelize.BOOLEAN,
                    "field": "onSunday",
                    "defaultValue": false
                },
                "onMonday": {
                    "type": Sequelize.BOOLEAN,
                    "field": "onMonday",
                    "defaultValue": true
                },
                "onTuesday": {
                    "type": Sequelize.BOOLEAN,
                    "field": "onTuesday",
                    "defaultValue": true
                },
                "onWednesday": {
                    "type": Sequelize.BOOLEAN,
                    "field": "onWednesday",
                    "defaultValue": true
                },
                "onThursday": {
                    "type": Sequelize.BOOLEAN,
                    "field": "onThursday",
                    "defaultValue": true
                },
                "onFriday": {
                    "type": Sequelize.BOOLEAN,
                    "field": "onFriday",
                    "defaultValue": true
                },
                "onSaturday": {
                    "type": Sequelize.BOOLEAN,
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
                "type": Sequelize.STRING,
                "field": "userId",
                "primaryKey": true
            }
        ]
    }
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);