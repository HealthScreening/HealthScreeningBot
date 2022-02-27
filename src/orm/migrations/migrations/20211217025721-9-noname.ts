// @ts-nocheck We don't want to check this file because it's an auto generated
// migration file.

/**
 * Actions summary:
 *
 * addIndex "auto_users_created_at" to table "AutoUsers"
 *
 **/

let info = {
  revision: 9,
  name: "noname",
  created: "2021-12-17T02:57:21.876Z",
  comment: "",
};

let migrationCommands = [
  {
    fn: "addIndex",
    params: [
      "AutoUsers",
      ["createdAt"],
      {
        indexName: "auto_users_created_at",
        name: "auto_users_created_at",
      },
    ],
  },
];

module.exports = require("../makeMigrationExport")(info, migrationCommands);
