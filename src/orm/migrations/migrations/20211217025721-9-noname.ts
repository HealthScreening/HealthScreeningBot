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

/**
 * Actions summary:
 *
 * addIndex "auto_users_created_at" to table "AutoUsers"
 *
 **/

let info = {
    "revision": 9,
    "name": "noname",
    "created": "2021-12-17T02:57:21.876Z",
    "comment": ""
};

let migrationCommands = [{
    fn: "addIndex",
    params: [
        "AutoUsers",
        ["createdAt"],
        {
            "indexName": "auto_users_created_at",
            "name": "auto_users_created_at"
        }
    ]
}];

module.exports = require("../makeMigrationExport")(info, migrationCommands);