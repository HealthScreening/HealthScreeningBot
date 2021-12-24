import { HSBAutocompleteInteraction } from "../../discordjs-overrides";
import logError from "../../utils/logError";
import serializeInteraction from "../../utils/logError/serializeInteraction";
import { getTrueCommand } from "../resolve";

export default async function commandInteractionAutocomplete(interaction: HSBAutocompleteInteraction){
try {
  const command = await getTrueCommand(interaction)
  if (!command){
    return;
  }

  const autocompleteField = interaction.options.getFocused(false);

  if (!command.autocompleteFields.has(autocompleteField)){
    await logError(
      new Error(`Command ${interaction.commandName} does not support autocomplete for field ${autocompleteField}`),
      "interaction::commandInteractionAutocomplete::commandDoesNotSupportAutocomplete",
      {
        interaction: serializeInteraction(interaction),
        supportedAutocompleteFields: Array.from(command.autocompleteFields.keys()),
      }
    );
    return await interaction.respond([])
  } else {
    try {
      // We confirmed earlier if it exists
      await command.autocompleteFields.get(autocompleteField)!(interaction);
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