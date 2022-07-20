import {
  APIButtonComponentWithCustomId,
  APISelectMenuComponent,
  ComponentType,
  MessageComponentInteraction,
} from "discord.js";

export default function serializeMessageComponentInteraction(
  interaction: MessageComponentInteraction
) {
  let componentData: object = {};
  switch (interaction.componentType) {
    case ComponentType.Button:
      const buttonComponent =
        interaction.component as APIButtonComponentWithCustomId;
      componentData = {
        customId: buttonComponent.custom_id,
        disabled: buttonComponent.disabled,
        emoji: buttonComponent.emoji,
        label: buttonComponent.label,
        style: buttonComponent.style,
      };
      break;
    case ComponentType.SelectMenu:
      const selectMenuComponent =
        interaction.component as APISelectMenuComponent;
      componentData = {
        customId: selectMenuComponent.custom_id,
        disabled: selectMenuComponent.disabled,
        minValues: selectMenuComponent.min_values,
        maxValues: selectMenuComponent.max_values,
        options: selectMenuComponent.options,
        placeholder: selectMenuComponent.placeholder,
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
