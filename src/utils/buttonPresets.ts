// This module serves as presets for some common button types
import { ButtonBuilder, ButtonStyle } from "discord.js";
import { titleCase } from "title-case";

import _buttonData from "../data/buttonPresets.json";

export interface PresetButtonBuilder {
  customId: string;
  disabled?: boolean;
  label?: string;
  emoji?: string;
  url?: string;
  style: string;
}

const buttonData: { [k: string]: PresetButtonBuilder } = _buttonData;

export default function getPresetButtonBuilder(
  customId: string
): ButtonBuilder {
  const button = new ButtonBuilder().setCustomId(customId);
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
    button.setStyle(ButtonStyle[titleCase(preset.style)]);
  }

  return button;
}
