import { sample } from "lodash";

import HealthScreeningBotClient from "./extraClient";

export default async function doAutoChangePresence(
  client: HealthScreeningBotClient
): Promise<void> {

  const presences: string[] = [
    "Paused for the summer! Use /set to unpause."
  ];

  // We only need to set the name.
  await client.user!.setPresence({ activities: [{ name: sample(presences) }] });

  setTimeout(() => doAutoChangePresence(client), 300000);
}
