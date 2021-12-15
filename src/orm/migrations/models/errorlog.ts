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
import { DataTypes as DT, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class ErrorLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }

  ErrorLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      errorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      errorDescription: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      errorStack: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      githubIssueNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ErrorLog",
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          fields: ["githubIssueNumber"],
        },
        {
          fields: ["createdAt"],
        },
        {
          fields: ["type"],
        },
      ],
    }
  );
  return ErrorLog;
};
