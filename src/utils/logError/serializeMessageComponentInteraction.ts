import {
  MessageButton,
  MessageComponentInteraction,
  MessageSelectMenu,
} from "discord.js";

export default function serializeMessageComponentInteraction(
  interaction: MessageComponentInteraction
) {
  let componentData: object = {};
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
    default:
      throw new Error(`Unknown component type: ${interaction.componentType}`);
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
