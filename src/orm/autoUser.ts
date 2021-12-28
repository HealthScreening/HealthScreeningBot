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

import screeningTypes, {
  screeningTypeType,
} from "@healthscreening/screening-types";

import { sequelize } from ".";

export interface AutoUserAttributes {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  vaccinated: boolean;
  hour: number;
  minute: number;
  type: screeningTypeType;
  emailOnly: boolean;
  paused: boolean;
}

export type AutoUserCreationAttributes = Optional<
  AutoUserAttributes,
  "hour" | "minute" | "type" | "emailOnly" | "paused"
>;

export class AutoUser
  extends Model<AutoUserAttributes, AutoUserCreationAttributes>
  implements AutoUserAttributes
{
  userId!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  vaccinated!: boolean;
  hour!: number;
  minute!: number;
  createdAt!: Date;
  type!: screeningTypeType;
  emailOnly!: boolean;
  paused!: boolean;
}

AutoUser.init(
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vaccinated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    hour: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 5,
    },
    minute: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 40,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.keys(screeningTypes),
      allowNull: false,
      defaultValue: "G",
    },
    emailOnly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    paused: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AutoUser",
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ["createdAt"],
      },
      {
        fields: ["hour", "minute"],
      },
      {
        fields: ["paused"],
      },
    ],
  }
);
