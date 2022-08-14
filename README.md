# HealthScreeningBot

[![GitHub forks](https://img.shields.io/github/forks/HealthScreening/HealthScreeningBot)](https://github.com/HealthScreening/HealthScreeningBot/network)
[![GitHub stars](https://img.shields.io/github/stars/HealthScreening/HealthScreeningBot)](https://github.com/HealthScreening/HealthScreeningBot/stargazers)
[![CI](https://github.com/HealthScreening/HealthScreeningBot/actions/workflows/main.yml/badge.svg)](https://github.com/HealthScreening/HealthScreeningBot/actions/workflows/main.yml)
[![Lint](https://github.com/HealthScreening/HealthScreeningBot/actions/workflows/lint.yml/badge.svg)](https://github.com/HealthScreening/HealthScreeningBot/actions/workflows/lint.yml)
[![CodeQL](https://github.com/HealthScreening/HealthScreeningBot/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/HealthScreening/HealthScreeningBot/actions/workflows/codeql-analysis.yml)

Does the health screening for you automatically.

## Usage

Please view [the quickstart guide](https://github.com/HealthScreening/HealthScreeningBot/blob/master/guides/quickstart.md) for learning how to get started.

## Self-Host

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation

1. Run `git clone https://github.com/HealthScreening/HealthScreeningBot.git`.
2. Extract the files.
3. Open a terminal to the `HealthScreeningBot` directory.
4. Run `npm install`.
5. ~~**NOTE: IF YOU ARE USING SQLITE (most likely), you _need_ to run `npm install sqlite3`.**~~
6. Create the config, as below. **This is required, the installation will not work without it.**
7. Run `npm run build`.
8. Run `npm run deploy`.
9. Run `npx sequelize-cli db:migrate`.

### Creating the Config

A file called `config.ts` needs to exist with pre-filled values. You can use the contents of [the CI config.ts](https://github.com/HealthScreening/HealthScreeningBot/blob/master/.github/workflows/ci.config.ts) as an example. This must exist on the root directory _prior_ to building.

The file needs to export three named objects (the name _must_ be the same):

1. A `database` variable that contains options for Sequelize. This is passed directly to Sequelize.
2. A `discord` variable that contains options for Discord.
3. A `github` variable that contains options for GitHub.

#### `database`

This is an object for the database. 

~~If you are using sqlite3 (highly recommended because it does not require you to install any additional software), import the Options type from sequelize and export an object like so:~~
```typescript
import { Options } from "sequelize";

export const database: Options = {
  dialect: "sqlite",
  storage: "./db.sqlite",
};
```

If you are using Postgres (**REQUIRED**), export an object that looks like this:

```typescript
import { Options } from "sequelize";

export const database: Options = {
  dialect: "postgres",
  username: "user",
  password: "user",
  database: "user",
  host: "localhost",
  port: 5432,
};
```

#### `discord`

This is an object for the discord bot. To obtain a bot account, follow [this guide](https://discordpy.readthedocs.io/en/stable/discord.html). Export an object that looks like this:

```typescript
export const discord = {
  token: "token",
  clientId: "id",
  guildId: "id",
  logChannelId: "id",
  ownerId: "id",
};
```

- `token`: The bot token. Reference the guide for getting this.
- `clientId`: The client ID of the bot. Found in the "General Information" tab of the bot app page.
- `guildId`: The primary server that the bot belongs to (the "HQ" server).
- `logChannelId`: The channel where the bot puts it's logs. Must belong to the server that is in `guildId`.
- `ownerId`: The user ID of the owner of the bot.

#### `github`

This is an object for the GitHub functionality of the bot. Placeholders can be used to disable functionality if you do not want to use the GitHub features. Export an object that looks like this (just leave "token"):

```typescript
export const github = {
  token: "token",
  owner: "HealthScreening",
  repo: "HealthScreeningBot",
};
```

- `token`: A GitHub [PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) of the bot account.
- `owner`: The owner of the repository the bot will post to. If the repo URL is `https://github.com/a/b`, the owner is `a`.
- `repo`: The repository name. If the repo URL is `https://github.com/a/b`, the repo name is `b`.

#### Full File

When complete, the `config.ts` file should look like this:

```typescript
export const database = {
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
  logChannelId: "id",
  ownerId: "id",
};

export const github = {
  token: "token",
  owner: "HealthScreening",
  repo: "HealthScreeningBot",
};
```

### Starting the Bot

In the main directory on a terminal, run `npm run start`.
