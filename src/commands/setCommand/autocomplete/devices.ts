import { devices } from "puppeteer";

import { HSBAutocompleteInteraction } from "../../../discordjs-overrides";

export default async function devicesAutocomplete(
  interaction: HSBAutocompleteInteraction
) {
  const input = interaction.options.getFocused(false) as string;
  let deviceNames = Object.values(devices)
    .map((device) => device.name)
    .filter(
      (name) =>
        name.toLowerCase().startsWith(input.toLowerCase()) &&
        !name.endsWith("landscape")
    );
  if (deviceNames.length > 25) {
    deviceNames = deviceNames.slice(0, 25);
  } else if (deviceNames.length <= 24 && deviceNames.includes(input)) {
    deviceNames.splice(1, 0, `${input} landscape`);
  }

  await interaction.respond(
    deviceNames.map((value) => ({
      name: value,
      value,
    }))
  );
}
