/**
 * Copyright (C) 2021-2022 PythonCoderAS
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
import { UserInfo, UserInfoParams } from "../interfaces";
import getAutoData from "./getAutoData";
import getAutoDayData from "./getAutoDayData";
import getDeviceData from "./getDeviceData";

export default async function getUserInfo(
  options: UserInfoParams
): Promise<UserInfo | null> {
  const deviceData = await getDeviceData(options);
  const dayData = await getAutoDayData(options);
  const returnData: UserInfo = {
    deviceInfo: deviceData,
    auto: {
      dayInfo: dayData,
    },
  };
  const autoData = await getAutoData(options);
  if (autoData !== null) {
    returnData.auto.info = autoData;
  }
  return returnData;
}
