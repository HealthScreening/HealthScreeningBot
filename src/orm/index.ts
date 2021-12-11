import { Sequelize } from "sequelize/types";
import { database } from "../../config";
import { exit } from "process";
export const sequelize: Sequelize = new Sequelize({
  logging: false,
  ...database
});

export async function init(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    exit(1);
  }
}
