import { sortedUniq } from "lodash";

import { HSBAutocompleteInteraction } from "../../../discordjs-overrides";

export default async function minuteAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const options: number[] = [];
  const value = interaction.options.getFocused(false) as number;
  for (let i = value; i <= value + 5; i++) {
    options.push(i);
  }
  for (let i = Math.ceil(value / 5) * 5; i < 60; i += 5) {
    options.push(i);
  }
  if (options.length <= 20) {
    for (let i = value - 1; i >= value - 5 && i >= 0; i--) {
      options.push(i);
    }
  }
  await interaction.respond(
    sortedUniq(options.sort((a, b) => a - b)).map((num) => {
      return {
        name: num.toString(),
        value: num,
      };
    })
  );
}
