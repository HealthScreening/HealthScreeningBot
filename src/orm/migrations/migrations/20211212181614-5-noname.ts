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
 * createTable "ErrorLogs", deps: []
 * addIndex "error_logs_github_issue_number" to table "ErrorLogs"
 * addIndex "error_logs_created_at" to table "ErrorLogs"
 *
 **/

let info = {
    "revision": 5,
    "name": "noname",
    "created": "2021-12-12T18:16:14.279Z",
    "comment": ""
};

let migrationCommands = [{
        fn: "createTable",
        params: [
            "ErrorLogs",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "errorName": {
                    "type": Sequelize.STRING,
                    "field": "errorName",
                    "allowNull": false
                },
                "errorDescription": {
                    "type": Sequelize.TEXT,
                    "field": "errorDescription",
                    "allowNull": true
                },
                "errorStack": {
                    "type": Sequelize.TEXT,
                    "field": "errorStack",
                    "allowNull": true
                },
                "githubIssueNumber": {
                    "type": Sequelize.INTEGER,
                    "field": "githubIssueNumber",
                    "allowNull": true
                },
                "metadata": {
                    "type": Sequelize.JSON,
                    "field": "metadata",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "ErrorLogs",
            ["githubIssueNumber"],
            {
                "indexName": "error_logs_github_issue_number",
                "name": "error_logs_github_issue_number"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "ErrorLogs",
            ["createdAt"],
            {
                "indexName": "error_logs_created_at",
                "name": "error_logs_created_at"
            }
        ]
    }
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);