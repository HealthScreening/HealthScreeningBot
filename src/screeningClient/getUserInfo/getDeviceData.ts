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
import { Devices } from "../../orm/devices";
import { DeviceInfo, UserInfoParams } from "../interfaces";

export default async function getDeviceData(
  options: UserInfoParams
): Promise<DeviceInfo> {
  const autoDaysItem = await Devices.findOne({
    where: { userId: options.userId },
  });
  return {
    userId: options.userId,
    device: autoDaysItem?.device || "iPhone 11",
  };
}
