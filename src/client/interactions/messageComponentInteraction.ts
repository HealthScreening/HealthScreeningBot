import { HSBMessageComponentInteraction } from "../../discordjs-overrides";
import logError from "../../utils/logError";
import serializeMessageComponentInteraction from "../../utils/logError/serializeMessageComponentInteraction";
import { ItemType, sendMessage } from "../../utils/multiMessage";

export default async function messageComponentInteraction(
  interaction: HSBMessageComponentInteraction
) {
  try {
    const { customId } = interaction;
    if (
      customId.length > 33 &&
      customId.at(32) === "_" &&
      !customId.slice(0, 32).includes("_")
    ) {
      // This is a UUID-prefixed custom ID, which is used by the custom component collectors.
      // Since this is not a global button, we can safely ignore it.
      return;
    }

    if (!interaction.client.globalButtonBuilders.has(customId)) {
      await logError(
        new Error(`Global ButtonBuilder ${customId} not found`),
        "interaction::globalButtonBuilder::buttonNotFound",
        serializeMessageComponentInteraction(interaction)
      );
      await sendMessage({
        itemType: ItemType.interaction,
        item: interaction,
        content:
          "The button you clicked was not found. Please try again or contact the bot owner.",
        ephemeral: true,
      });
      return;
    }

    const buttonAction = interaction.client.globalButtonBuilders.get(customId)!;
    try {
      await buttonAction(interaction);
    } catch (error) {
      // Skipped because no better way to do this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata: { [k: string]: any } =
        serializeMessageComponentInteraction(interaction);
      await logError(error, "interaction::globalButtonBuilder", metadata);
      try {
        await sendMessage({
          itemType: ItemType.interaction,
          item: interaction,
          content:
            "Unfortunately, the button has encountered an error. This error has been logged and will be fixed ASAP.",
          ephemeral: true,
        });
        return;
      } catch (e2) {
        metadata.deferred = interaction.deferred;
        metadata.replied = interaction.replied;
        await logError(
          e2,
          "interaction::globalButtonBuilder::errorReply",
          metadata
        );
      }
    }
  } catch (e) {
    await logError(
      e,
      "interaction::globalButtonBuilder::processing",
      serializeMessageComponentInteraction(interaction)
    );
  }
}
