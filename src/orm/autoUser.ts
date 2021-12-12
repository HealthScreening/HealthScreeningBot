import { DataTypes, Model } from "sequelize";
import { sequelize } from ".";

export interface AutoUserAttributes{
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  vaccinated: boolean;
  hour: number;
  minute: number;
}

class AutoUser extends Model<AutoUserAttributes, AutoUserAttributes> implements AutoUserAttributes {
  userId!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  vaccinated!: boolean;
  hour!: number;
  minute!: number;
  createdAt!: Date;
}

AutoUser.init({
  userId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vaccinated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  hour: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 5
  },
  minute: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 40
  }
}, {
  sequelize,
  modelName: 'AutoUser',
  timestamps: true,
  updatedAt: false
});
