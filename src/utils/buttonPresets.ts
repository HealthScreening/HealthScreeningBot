// This module serves as presets for some common button types
import { Button, ButtonStyleResolvable } from "discord.js";

import _buttonData from "../data/buttonPresets.json";

export interface PresetButton {
  customId: string;
  disabled?: boolean;
  label?: string;
  emoji?: string;
  url?: string;
  style: string;
}

const buttonData: { [k: string]: PresetButton } = _buttonData;

export default function getPresetButton(customId: string): Button {
  const button = new Button().setCustomId(customId);
  const preset = buttonData[customId];
  if (preset.disabled) {
    button.setDisabled(true);
  }

  if (preset.label) {
    button.setLabel(preset.label);
  }

  if (preset.emoji) {
    button.setEmoji(preset.emoji);
  }

  if (preset.url) {
    button.setURL(preset.url);
  }

  if (preset.style) {
    button.setStyle(preset.style as ButtonStyleResolvable);
  }

  return button;
}
