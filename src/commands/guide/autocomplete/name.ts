import { HSBAutocompleteInteraction } from "../../../discordjs-overrides";

export default async function nameAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const input = interaction.options.getFocused(false) as string;
  const options = Array.from(interaction.client.guideData.keys())
    .filter((name) => name.startsWith(input))
    .sort()
    .slice(0, 25)
    .map((name) => ({
      name,
      value: name,
    }));
  await interaction.respond(options);
}
