import { ActionRowBuilder, ButtonBuilder } from "discord.js";

import HealthScreeningBotClient from "../../../client/extraClient";
import getPresetButtonBuilder from "../../../utils/buttonPresets";
import { MessageOptions, sendMessage } from "../../../utils/multiMessage";

export default async function sendQuickstart(
  client: HealthScreeningBotClient,
  options: MessageOptions
) {
  await sendMessage({
    embeds: client.guideData.get("quickstart")!,
    components: [
      new ActionRowBuilder<ButtonBuilder>().addComponents(getPresetButtonBuilder("go_to_dm")),
    ],
    ...options,
  });
}
