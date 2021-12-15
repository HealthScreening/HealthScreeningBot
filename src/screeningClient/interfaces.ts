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
import {
  GenerateScreenshotParams,
  screeningTypeType,
} from "../utils/produceScreenshot/interfaces";
import { MessageOptions, serializeMessageOptions } from "../utils/multiMessage";
import { TextChannel } from "discord.js";

export interface AutoBatchOptions {
  batchTime: [number, number];
  itemNumber: number;
  logChannel: TextChannel;
  dmScreenshot: boolean;
}

export function serializeAutoBatchOptions(options: AutoBatchOptions) {
  return {
    batchTime: options.batchTime,
    itemNumber: options.itemNumber,
    logChannel: options.logChannel.id,
    dmScreenshot: options.dmScreenshot,
  };
}

export interface Cooldown {
  container: Set<string>;
  id: string;
}

export function serializeCooldown(cooldown: Cooldown) {
  return {
    containerSize: cooldown.container.size,
    id: cooldown.id,
  };
}

/**
 * This consists of three parts: <ul>
 *  <li>auto: The auto parameters. This consists of two parts: <ul>
 *      <li>isAuto: Whether or not the bot is in auto mode.</li>
 *      <li>isManualAuto: Whether or not the bot is in manual auto mode.</li></ul></li>
 *  <li>generateScreenshotParams: The parameters required for generating a screenshot.</li>
 *  <li>multiMessageParams: The parameters required for sending a message.</li></ul>
 */
export interface ProcessParams {
  generateScreenshotParams: GenerateScreenshotParams;
  multiMessageParams: MessageOptions;
  auto?: AutoBatchOptions;
  cooldown?: Cooldown;
}

export function serializeProcessParams(params: ProcessParams) {
  const obj: { [k: string]: object } = {
    generateScreenshotParams: params.generateScreenshotParams,
    multiMessageParams: serializeMessageOptions(params.multiMessageParams),
  };
  if (params.auto) {
    obj.auto = serializeAutoBatchOptions(params.auto);
  }
  if (params.cooldown) {
    obj.cooldown = serializeCooldown(params.cooldown);
  }
  return obj;
}

export interface AutoInfo {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  vaccinated: boolean;
  time: {
    hour: number;
    minute: number;
  };
  type: screeningTypeType;
}

export interface AutoDayInfo {
  userId: string;
  onSunday: boolean;
  onMonday: boolean;
  onTuesday: boolean;
  onWednesday: boolean;
  onThursday: boolean;
  onFriday: boolean;
  onSaturday: boolean;
}

export interface DeviceInfo {
  userId: string;
  device: string;
}

/**
 * Possible user info that is possible to obtain.
 */
export interface UserInfo {
  auto: {
    info?: AutoInfo;
    dayInfo: AutoDayInfo;
  };
  deviceInfo: DeviceInfo;
}

export interface UserInfoParams {
  userId: string;
  errorOnInvalid?: MessageOptions;
}
