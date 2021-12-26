import { HSBAutocompleteInteraction } from "../../../discordjs-overrides";

export default async function nameAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const input = interaction.options.getFocused(false) as string;
  let options = Array.from(interaction.client.guideData.keys())
    .filter((name) => name.startsWith(input))
    .sort();
  if (!input.startsWith("_")) {
    options = options.filter((name) => !name.startsWith("_"));
  }
  await interaction.respond(
    options.slice(0, 25).map((name) => ({
      name,
      value: name,
    }))
  );
}
