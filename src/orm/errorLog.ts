import { DataTypes, Model, Optional } from "sequelize";

import { sequelize } from ".";

export interface ErrorLogAttributes {
  id: number;
  errorName: string;
  errorDescription: string | null;
  errorStack: string | null;
  metadata: object | null;
  type: string;
}

export type ErrorLogCreationAttributes = Optional<
  ErrorLogAttributes,
  "id" | "errorDescription" | "errorStack" | "metadata"
>;

export class ErrorLog
  extends Model<ErrorLogAttributes, ErrorLogCreationAttributes>
  implements ErrorLogAttributes
{
  id!: number;
  errorName!: string;
  errorDescription!: string | null;
  errorStack!: string | null;
  metadata!: object | null;
  type!: string;
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
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "ErrorLog",
    timestamps: true,
    updatedAt: false,
    indexes: [
      {
        fields: ["createdAt"],
      },
      {
        fields: ["type"],
      },
    ],
  }
);
