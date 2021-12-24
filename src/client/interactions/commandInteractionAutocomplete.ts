import { HSBCommandInteraction } from "../../discordjs-overrides";
import logError from "../../utils/logError";
import serializeInteraction from "../../utils/logError/serializeInteraction";
import handleCommandError from "../../utils/handleCommandError";
import { ItemType, sendMessage } from "../../utils/multiMessage";

export default async function commandInteractionAutocomplete(interaction: HSBCommandInteraction){
try {
  const command = interaction.client.commands.get(
    interaction.commandName
  );

  if (!command) {
    await logError(
      new Error(`Command ${interaction.commandName} not found`),
      "interaction::commandInteractionAutocomplete::commandNotFound",
      serializeInteraction(interaction)
    );
    await handleCommandError(
      { itemType: ItemType.interaction, item: interaction },
      interaction.commandName
    );
    return;
  }

  if (!command.showAutocomplete){
    await logError(
      new Error(`Command ${interaction.commandName} does not support autocomplete`),
      "interaction::commandInteractionAutocomplete::commandDoesNotSupportAutocomplete",
      serializeInteraction(interaction)
    );
    await handleCommandError(
      { itemType: ItemType.interaction, item: interaction },
      interaction.commandName
    );
  } else {
    try {
      await command.showAutocomplete(interaction);
    } catch (error) {
      // Skipped because no better way to do this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata: { [k: string]: any } =
        serializeInteraction(interaction);
      await logError(error, "interaction::commandInteractionAutocomplete", metadata);
      try {
        await sendMessage({
          itemType: ItemType.interaction,
          item: interaction,
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } catch (e2) {
        metadata.deferred = interaction.deferred;
        metadata.replied = interaction.replied;
        await logError(e2, "interaction::commandInteractionAutocomplete::errorReply", metadata);
      }
    }
  }
} catch (e) {
  await logError(
    e,
    "interaction::commandInteractionAutocomplete::processing",
    serializeInteraction(interaction)
  );
}
}