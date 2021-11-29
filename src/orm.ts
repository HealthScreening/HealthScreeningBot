import {DataTypes, Model, Optional, Sequelize} from "sequelize"

const config = require("../config.json")
const sequelize: Sequelize = new Sequelize(config.database)

interface ConfigAttributes {
    id: number
    userId: string
    firstName: string
    lastName: string
    email: string
    vaccinated: boolean
    timeHours: number
    timeMinutes: number
    device: string
}

interface ConfigCreationAttributes extends Optional<ConfigAttributes, "id" | "vaccinated" | "timeHours" | "timeMinutes" | "device"> {
}

export class Config extends Model<ConfigAttributes, ConfigCreationAttributes> implements ConfigAttributes {
    public id!: number
    public userId!: string
    public firstName!: string
    public lastName!: string
    public email!: string
    public vaccinated!: boolean
    public timeHours!: number
    public timeMinutes!: number
    public device!: string

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Config.init({
    // Model attributes are defined here
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
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
    },
    device: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "iPhone 11"
    },
}, {sequelize})

export async function init() {
    await sequelize.sync({alter: true})
}