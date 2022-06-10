import { TextChannel } from "discord.js";

import { screeningTypeType } from "@healthscreening/screening-types";

import { MessageOptions, serializeMessageOptions } from "../utils/multiMessage";
import { GenerateScreenshotParams } from "../utils/produceScreenshot";

export interface AutoBatchOptions {
  batchTime: [number, number];
  itemNumber: number;
  logChannel: TextChannel;
  dmScreenshot?: boolean;
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
 *      <li>isAuto: Whether the bot is in auto mode.</li>
 *      <li>isManualAuto: Whether the bot is in manual auto mode.</li></ul></li>
 *  <li>generateScreenshotParams: The parameters required for generating a screenshot.</li>
 *  <li>multiMessageParams: The parameters required for sending a message.</li></ul>
 */
export interface ProcessParams {
  generateScreenshotParams: GenerateScreenshotParams;
  multiMessageParams: MessageOptions;
  auto?: AutoBatchOptions;
  cooldown?: Cooldown;
  isSetAuto?: boolean;
  emailOnly?: boolean;
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
  emailOnly: boolean;
  paused: boolean;
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
