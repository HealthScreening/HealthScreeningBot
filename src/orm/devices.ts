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
import { DataTypes, Model } from "sequelize";

import { sequelize } from ".";

export interface DevicesAttributes {
  userId: string;
  device: string;
}

export class Devices
  extends Model<DevicesAttributes, DevicesAttributes>
  implements DevicesAttributes
{
  userId!: string;
  device!: string;
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
