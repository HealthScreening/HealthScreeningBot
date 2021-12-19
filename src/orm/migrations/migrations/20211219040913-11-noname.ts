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
 * addColumn "emailOnly" to table "AutoUsers"
 * addColumn "paused" to table "AutoUsers"
 * addIndex "auto_users_paused" to table "AutoUsers"
 *
 **/

let info = {
    "revision": 11,
    "name": "noname",
    "created": "2021-12-19T04:09:13.669Z",
    "comment": ""
};

let migrationCommands = [{
        fn: "addColumn",
        params: [
            "AutoUsers",
            "emailOnly",
            {
                "type": Sequelize.BOOLEAN,
                "field": "emailOnly",
                "defaultValue": false,
                "allowNull": false
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "AutoUsers",
            "paused",
            {
                "type": Sequelize.BOOLEAN,
                "field": "paused",
                "defaultValue": false,
                "allowNull": false
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "AutoUsers",
            ["paused"],
            {
                "indexName": "auto_users_paused",
                "name": "auto_users_paused"
            }
        ]
    }
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
