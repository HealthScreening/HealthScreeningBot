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

import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";

export interface AutoDaysAttributes {
  userId: string;
  onSunday: boolean;
  onMonday: boolean;
  onTuesday: boolean;
  onWednesday: boolean;
  onThursday: boolean;
  onFriday: boolean;
  onSaturday: boolean;
}

export class AutoDays
  extends Model<AutoDaysAttributes, AutoDaysAttributes>
  implements AutoDaysAttributes
{
  userId!: string;
  onSunday!: boolean;
  onMonday!: boolean;
  onTuesday!: boolean;
  onWednesday!: boolean;
  onThursday!: boolean;
  onFriday!: boolean;
  onSaturday!: boolean;
}

AutoDays.init(
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    onSunday: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    onMonday: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    onTuesday: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    onWednesday: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    onThursday: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    onFriday: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    onSaturday: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AutoDays",
    timestamps: false,
  }
);
