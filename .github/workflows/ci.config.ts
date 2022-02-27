import { Options } from "sequelize";

// This is a sample config.ts file so that typescript compilation succeeds on
// continuous integration.

export const database: Options = {
  dialect: "postgres",
  username: "user",
  password: "user",
  database: "user",
  host: "localhost",
  port: 5432,
};

export const discord = {
  token: "token",
  clientId: "id",
  guildId: "id",
};

export const github = {
  token: "token",
  owner: "HealthScreening",
  repo: "HealthScreeningBot",
};
