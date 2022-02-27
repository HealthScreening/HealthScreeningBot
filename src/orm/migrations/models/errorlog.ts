import { DataTypes as DT, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class ErrorLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
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
  return ErrorLog;
};
