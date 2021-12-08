import { Options } from "sequelize/types";

export const database: Options = {
  "storage": "./data.db",
  "dialect": "sqlite",
};

export const discord = {
  "token": "<bot token>",
  "clientId": "890001571004448800",
  "guildId": "889983763994521610",
};
