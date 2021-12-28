/**
 * Copyright (C) 2021 PythonCoderAS
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
// This module serves as presets for some common button types
import { MessageButton, MessageButtonStyleResolvable } from "discord.js";

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

export default function getPresetButton(customId: string): MessageButton {
  const button = new MessageButton().setCustomId(customId);
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
    button.setStyle(preset.style as MessageButtonStyleResolvable);
  }
  return button;
}
