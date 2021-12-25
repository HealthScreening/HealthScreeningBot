// This module serves as presets for some common button types

import { MessageButton, MessageButtonStyleResolvable } from "discord.js";
import _buttonData from "../../buttonPresets.json";


export interface PresetButton {
  customId: string;
  disabled?: boolean;
  label?: string;
  emoji?: string;
  url?: string;
  style?: string;
}

const buttonData: { [k: string]: PresetButton } = _buttonData;

export default function getPresetButton(customId: string): MessageButton {
  const button = new MessageButton().setCustomId(customId);
  const preset = buttonData[customId];
  if (preset.disabled){
    button.setDisabled(true);
  }
  if (preset.label){
    button.setLabel(preset.label);
  }
  if (preset.emoji){
    button.setEmoji(preset.emoji);
  }
  if (preset.url){
    button.setURL(preset.url);
  }
  if (preset.style){
    button.setStyle(preset.style as MessageButtonStyleResolvable);
  }
  return button;
}