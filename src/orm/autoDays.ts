import { DataTypes, Model, Optional } from "sequelize";

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

export type AutoDaysCreationAttributes = Optional<
  AutoDaysAttributes,
  | "onSunday"
  | "onMonday"
  | "onTuesday"
  | "onWednesday"
  | "onThursday"
  | "onFriday"
  | "onSaturday"
>;

export class AutoDays
  extends Model<AutoDaysAttributes, AutoDaysCreationAttributes>
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
      allowNull: false,
      defaultValue: false,
    },
    onMonday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    onTuesday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    onWednesday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    onThursday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    onFriday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    onSaturday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "AutoDays",
    timestamps: false,
  }
);
