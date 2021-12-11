import { DataTypes, Model, Optional } from "sequelize/types";
import { sequelize } from ".";

export interface AutoUserAttributes{
  id: number
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  vaccinated: boolean;
}

export type AutoUserCreationAttributes = Optional<AutoUserAttributes, 'id'>;

class AutoUser extends Model<AutoUserAttributes, AutoUserCreationAttributes> implements AutoUserAttributes{
  id!: number;
  userId?: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  vaccinated!: boolean;

}

AutoUser.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
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
  vaccinated: DataTypes.BOOLEAN
}, {
  sequelize,
  modelName: 'AutoUser',
});
