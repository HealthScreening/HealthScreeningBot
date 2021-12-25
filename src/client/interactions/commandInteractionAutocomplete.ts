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

  const autocompleteField = interaction.options.getFocused(true).name;

  const toRun = command.parts.filter((item) => item.beforeAutocomplete)
  for (const checkToRun of toRun){
    if (!(await checkToRun.beforeAutocomplete!(interaction))){
      return await interaction.respond([]);
    }
  }

  if (!command.resolved.autocompleteFields.has(autocompleteField)){
    await logError(
      new Error(`Command ${command.fullName} does not support autocomplete for field ${autocompleteField}`),
      "interaction::commandInteractionAutocomplete::commandDoesNotSupportAutocomplete",
      {
        interaction: serializeInteraction(interaction),
        supportedAutocompleteFields: Array.from(command.resolved.autocompleteFields.keys()),
      }
    );
    return await interaction.respond([])
  } else {
    try {
      // We confirmed earlier if it exists
      await command.resolved.autocompleteFields.get(autocompleteField)!(interaction);
    } catch (error) {
      await logError(error, "interaction::commandInteractionAutocomplete", serializeInteraction(interaction));
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