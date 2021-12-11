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

import { MessageOptions, sendMessage } from "../../utils/multiMessage";
import { UserInfo, UserInfoParams } from "../interfaces";
import { Config } from "../../orm";

export default async function getUserInfo(options: UserInfoParams): Promise<UserInfo | null> {
  const configItem = await Config.findOne({
    where: { userId: options.userId }
  });
  if (configItem === null) {
    if (options.errorOnInvalid) {
      const messageParams: MessageOptions = {
        content:
          "You do not have any auto information stored! Use `/set_auto` to set some information.",
        ephemeral: true,
        ...options.errorOnInvalid
      };
      await sendMessage(messageParams);
      return null;
    }
    else {
      return {
        userId: options.userId,
        device: "iPhone 11"
      };
    }
  }
  else {
    return {
      userId: options.userId,
      auto: {
        firstName: configItem.firstName,
        lastName: configItem.lastName,
        email: configItem.email,
        vaccinated: configItem.vaccinated,
        time: {
          hour: configItem.timeHours,
          minute: configItem.timeMinutes
        }
      },
      device: configItem.device
    };
  }
}