import HealthScreeningBotClient from "./extraClient";
import logError from "../utils/logError";
import sleep from "sleep-promise";

export default async function doGuildMemberCacheUpdate(
  client: HealthScreeningBotClient
): Promise<void> {
  try {
    for (const guild of client.guilds.cache.values()) {
      await guild.members.fetch();
      await sleep(10 * 1000);
    }
  } catch (e) {
    await logError(e, "doGuildMemberCacheUpdate");
  }
  setTimeout(() => doGuildMemberCacheUpdate(client), 60 * 60 * 1000);
}
