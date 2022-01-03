/**
 * Copyright (C) 2021-2022 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  MessageButton,
  MessageComponentInteraction,
  MessageSelectMenu,
} from "discord.js";

export default function serializeMessageComponentInteraction(
  interaction: MessageComponentInteraction
) {
  let componentData: object;
  let component: MessageButton | MessageSelectMenu;
  switch (interaction.componentType) {
    case "BUTTON":
      component = interaction.component as MessageButton;
      componentData = {
        customId: component.customId,
        disabled: component.disabled,
        emoji: component.emoji,
        label: component.label,
        style: component.style,
        url: component.url,
      };
      break;
    case "SELECT_MENU":
      component = interaction.component as MessageSelectMenu;
      componentData = {
        customId: component.customId,
        disabled: component.disabled,
        minValues: component.minValues,
        maxValues: component.maxValues,
        options: component.options,
        placeholder: component.placeholder,
      };
      break;
  }
  return {
    channel: interaction.channelId,
    component: {
      type: interaction.componentType,
      data: componentData,
    },
    deferred: interaction.deferred,
    replied: interaction.replied,
    ephemeral: interaction.ephemeral,
    message: interaction.message.id,
  };
}
