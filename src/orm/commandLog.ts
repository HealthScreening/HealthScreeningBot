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
import { DataTypes, Model, Optional } from "sequelize";

import { sequelize } from ".";

export interface CommandLogAttributes {
  id: number;
  userId: string;
  userName: string;
  commandName: string;
}

export type CommandLogCreationAttributes = Optional<CommandLogAttributes, "id">;

export class CommandLog
  extends Model<CommandLogAttributes, CommandLogCreationAttributes>
  implements CommandLogAttributes
{
  id!: number;
  userId!: string;
  userName!: string;
  commandName!: string;

  readonly createdAt!: Date;
}

CommandLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    commandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CommandLog",
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["commandName"],
      },
    ],
  }
);
