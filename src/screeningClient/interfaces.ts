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
import { GenerateScreenshotParams } from "../utils/produceScreenshot/interfaces";
import { MessageOptions } from "../utils/multiMessage";
import { TextChannel } from "discord.js";

export interface AutoBatchOptions {
  batchTime: [number, number];
  itemNumber: number;
  logChannel: TextChannel;
}

export interface Cooldown {
  container: Set<string>
  id: string
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

/**
 * Possible user info that is possible to obtain.
 */
export interface UserInfo {
  userId: string;
  auto?: {
    firstName: string;
    lastName: string;
    email: string;
    vaccinated: boolean;
    time: {
      hour: number;
      minute: number;
    };
  };
  device: string;
}

export interface UserInfoParams {
  userId: string;
  errorOnInvalid?: MessageOptions;
}