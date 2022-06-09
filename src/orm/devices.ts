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
