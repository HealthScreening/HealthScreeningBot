import { Intents } from "discord.js";
import { init } from "./orm";
import HealthScreeningBotClient from "./client/extraClient";
import { startupBrowser } from "./utils/produce_screenshot";

const { discord } = require("../config.json");

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILDS);
myIntents.add(Intents.FLAGS.GUILD_MEMBERS);
myIntents.add(Intents.FLAGS.GUILD_MESSAGES);
myIntents.add(Intents.FLAGS.DIRECT_MESSAGES);

const client: HealthScreeningBotClient = new HealthScreeningBotClient({
  intents: myIntents,
  partials: ["CHANNEL"],
});

// Login to Discord with your client's token
init()
  .then(startupBrowser)
  .then(function() {
    client.login(discord.token);
  });
