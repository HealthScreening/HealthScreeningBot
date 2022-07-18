import { GatewayIntentBits, Partials } from "discord.js";
import process from "process";

import {
  closeBrowser,
  startupBrowser,
} from "@healthscreening/generate-screenshot";

import { discord } from "../config";
import HealthScreeningBotClient from "./client/extraClient";
import { init, sequelize } from "./orm";
import { loadAllGuides } from "./utils/guides";
import logError from "./utils/logError";

const myIntents = new GatewayIntentBits();
myIntents.add(Intents.FLAGS.GUILDS);
myIntents.add(Intents.FLAGS.GUILD_MEMBERS);
myIntents.add(Intents.FLAGS.GUILD_MESSAGES);
myIntents.add(Intents.FLAGS.DIRECT_MESSAGES);

const client: HealthScreeningBotClient = new HealthScreeningBotClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
  partials: [Partials.Channel],
});

async function shutdown(errcode = 1) {
  await closeBrowser();
  await sequelize.close();
  client.destroy();
  process.exit(errcode);
}

process.on("SIGINT", async () => {
  await shutdown();
});

process.on("SIGTERM", async () => {
  await shutdown();
});

async function startup() {
  try {
    await init();
    process.on("warning", (warning) => logError(warning, "warning"));
    await startupBrowser();
    await loadAllGuides(client);
    await client.login(discord.token);
  } catch (e) {
    await logError(e, "root");
    console.error(e);
    await shutdown();
  }
}

startup().then(() => {
  console.log("Bot startup complete.");
});
