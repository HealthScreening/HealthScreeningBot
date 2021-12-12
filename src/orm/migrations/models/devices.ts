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
import { Model, Sequelize, DataTypes as DT } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Devices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }

  Devices.init(
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      device: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "iPhone 11",
      },
    },
    {
      sequelize,
      modelName: "Devices",
      timestamps: false,
    }
  );
  return Devices;
};
