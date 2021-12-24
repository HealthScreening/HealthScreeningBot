import { HSBAutocompleteInteraction } from "../../discordjs-overrides";
import logError from "../../utils/logError";
import serializeInteraction from "../../utils/logError/serializeInteraction";

export default async function commandInteractionAutocomplete(interaction: HSBAutocompleteInteraction){
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
    return await interaction.respond([])
  }

  if (!command.showAutocomplete){
    await logError(
      new Error(`Command ${interaction.commandName} does not support autocomplete`),
      "interaction::commandInteractionAutocomplete::commandDoesNotSupportAutocomplete",
      serializeInteraction(interaction)
    );
    return await interaction.respond([])
  } else {
    try {
      await command.showAutocomplete(interaction);
    } catch (error) {
      // Skipped because no better way to do this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata: { [k: string]: any } =
        serializeInteraction(interaction);
      await logError(error, "interaction::commandInteractionAutocomplete", metadata);
      return await interaction.respond([])
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