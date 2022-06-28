import { sample } from "lodash";

import { AutoUser } from "../orm/autoUser";
import HealthScreeningBotClient from "./extraClient";

export default async function doAutoChangePresence(
  client: HealthScreeningBotClient
): Promise<void> {
  const guildSize = client.guilds.cache.size;
  const registeredPeople = await AutoUser.count();

  const presences: string[] = [
    "Generating Health Screenings",
    `In ${guildSize} servers`,
    `Generating for ${registeredPeople} people!`,
    "/guide name:walkthrough for walkthrough of commands!",
    "Report a bug with /report_bug!",
    "Use /set to set optional configuration info!",
    "can i put ma balls on ya jaws",
    "Run /stats for cool stats about the bot!",
    "Check out your profile with /profile!",
    "Have an idea? Suggest it with /suggest!",
  ];

  // We only need to set the name.
  await client.user!.setPresence({ activities: [{ name: sample(presences) }] });

  setTimeout(() => doAutoChangePresence(client), 300000);
}
