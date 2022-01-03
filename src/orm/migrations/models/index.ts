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
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    /* eslint-disable @typescript-eslint/no-var-requires -- Disabled because
      we dynamically require, which is impossible with typescript's import system. */
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    /* eslint-enable @typescript-eslint/no-var-requires */
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
