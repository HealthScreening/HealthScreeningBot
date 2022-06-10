import { DataTypes as DT, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class CommandLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // Define association here
    }
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
  return CommandLog;
};
