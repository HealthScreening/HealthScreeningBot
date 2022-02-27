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
