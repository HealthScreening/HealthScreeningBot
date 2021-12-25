import { Op } from "sequelize";
import { HSBAutocompleteInteraction } from "../../../../../discordjs-overrides";
import { ErrorLog } from "../../../../../orm/errorLog";

export default async function typeStartsWithAutocomplete(interaction: HSBAutocompleteInteraction){
  const response = interaction.options.getFocused(false) as string;
  await interaction.respond((await ErrorLog.findAll({
    where: {
      type: {
        [Op.startsWith]: response as string
      }
    },
    limit: 25,
    group: ["type"]
  })).map((item) => {
    return {
      name: item.type,
      value: item.type
    }
  }))
}