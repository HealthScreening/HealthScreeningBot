import { HSBAutocompleteInteraction } from "../../../discordjs-overrides";

export default async function minuteAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const options: { name: string; value: number }[] = [];
  const value = interaction.options.getFocused(false) as number;
  for (let i = value; i <= value + 6; i++) {
    options.push({
      name: i.toString(),
      value: i,
    });
  }
  for (let i = value + 5; i < 60; i += 5) {
    options.push({
      name: i.toString(),
      value: i,
    });
  }
  if (options.length <= 20) {
    for (let i = value - 1; i >= value - 5 && i >= 0; i--) {
      options.push({
        name: i.toString(),
        value: i,
      });
    }
  }
  await interaction.respond(options.sort((a, b) => a.value - b.value));
}
