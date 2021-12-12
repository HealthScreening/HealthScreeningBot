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

import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from ".";
export interface ErrorLogAttributes {
  id: number
  errorName: string;
  errorDescription: string | null;
  errorStack: string | null;
  githubIssueNumber: number | null;
  metadata: object | null;
}

export type ErrorLogCreationAttributes = Optional<ErrorLogAttributes, "id" | "errorDescription" | "errorStack" | "githubIssueNumber" | "metadata" >

export class ErrorLog
  extends Model<ErrorLogAttributes, ErrorLogCreationAttributes>
  implements ErrorLogAttributes
{
  id!: number;
  errorName!: string;
  errorDescription!: string | null;
  errorStack!: string | null;
  githubIssueNumber!: number | null;
  metadata!: object | null;
  createdAt!: Date;
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
      type: DataTypes.JSON,
      allowNull: true,
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
        fields: ["createdAt"]
      }
    ]
  }
);
