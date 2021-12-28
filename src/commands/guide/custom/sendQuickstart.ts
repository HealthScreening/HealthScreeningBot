import { MessageActionRow } from "discord.js";

import HealthScreeningBotClient from "../../../client/extraClient";
import getPresetButton from "../../../utils/buttonPresets";
import { MessageOptions, sendMessage } from "../../../utils/multiMessage";

export default async function sendQuickstart(
  client: HealthScreeningBotClient,
  options: MessageOptions
) {
  await sendMessage({
    embeds: client.guideData.get("quickstart")!,
    components: [
      new MessageActionRow().addComponents(getPresetButton("go_to_dm")),
    ],
    ...options,
  });
}
