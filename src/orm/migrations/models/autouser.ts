import { DataTypes as DT, Model, Sequelize } from "sequelize";

import screeningTypes from "@healthscreening/screening-types";

module.exports = (sequelize: Sequelize, DataTypes: typeof DT) => {
  class AutoUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // Define association here
    }
  }
  AutoUser.init(
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      vaccinated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      hour: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 5,
      },
      minute: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 40,
      },
      type: {
        type: DataTypes.ENUM,
        values: Object.keys(screeningTypes),
        allowNull: false,
        defaultValue: "G",
      },
      emailOnly: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      paused: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "AutoUser",
      timestamps: true,
      updatedAt: false,
      indexes: [
        {
          fields: ["createdAt"],
        },
        {
          fields: ["hour", "minute"],
        },
        {
          fields: ["paused"],
        },
      ],
    }
  );
  return AutoUser;
};
