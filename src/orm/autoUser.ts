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
