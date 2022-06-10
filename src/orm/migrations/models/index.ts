import { readdirSync } from "fs";
import * as path from "path";
import { DataTypes, Sequelize } from "sequelize";

import { database as config } from "../../../../config";

const basename = path.basename(__filename);

export interface DB {
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
}
const db: DB = {};

const sequelize: Sequelize = new Sequelize(config);

readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    /* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
     -- Disabled because we dynamically require, which is impossible with
     typescript's import system. */
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    /* eslint-enable @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require */
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
