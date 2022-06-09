import { DataTypes as DT, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class Devices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // Define association here
    }
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
  return Devices;
};
