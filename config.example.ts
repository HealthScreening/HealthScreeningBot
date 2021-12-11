import { Options } from "sequelize/types";

export const database: Options = {
  dialect: "postgres",
  username: "healthscreeningbot",
  password: "healthscreeningbot",
  database: "healthscreeningbot",
  host: "localhost",
  port: 5432
};

export const discord = {
  token: "<bot token>",
  clientId: "890001571004448800",
  guildId: "889983763994521610",
};
