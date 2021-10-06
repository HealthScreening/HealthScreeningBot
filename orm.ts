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
    }
});

export async function init(){
    await sequelize.sync({alter: true})
}