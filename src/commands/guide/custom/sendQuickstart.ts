import { MessageOptions, sendMessage } from "../../../utils/multiMessage";
import HealthScreeningBotClient from "../../../client/extraClient";
import { MessageActionRow } from "discord.js";
import getPresetButton from "../../../utils/buttonPresets";

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
