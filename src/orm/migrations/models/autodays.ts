import { DataTypes as DT, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class AutoDays extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // Define association here
    }
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
  return AutoDays;
};
