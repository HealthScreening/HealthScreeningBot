import { devices } from "puppeteer";
import { HSBAutocompleteInteraction } from "../../../discordjs-overrides";

export default async function devicesAutocomplete(interaction: HSBAutocompleteInteraction) {
  let deviceNames = Object.values(devices).map(device => device.name).filter((name) => name.startsWith(interaction.options.getFocused(false) as string) && !name.endsWith("landscape"));
  if (deviceNames.length > 25){
    deviceNames = deviceNames.slice(0, 25);
  }
  await interaction.respond(deviceNames.map((value => {
    return {
      name: value,
      value
    }
  })));
}