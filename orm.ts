import {DataTypes, Sequelize} from "sequelize"

const config = require("./config.json")
const sequelize: Sequelize = new Sequelize(config.database)

export const Config = sequelize.define('Config', {
    // Model attributes are defined here
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
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
        allowNull: false
    },
    vaccinated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    timeHours: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 5
    },
    timeMinutes: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 40
    }
});

export const AdditionalConfig = sequelize.define('AdditionalConfig', {
        // Model attributes are defined here
        userId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        device: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "iPhone 11"
        },
    }
)

export async function init() {
    await sequelize.sync({alter: true})
}