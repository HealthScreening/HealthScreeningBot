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
import { AutoDays } from "../../orm/autoDays";
import { AutoDayInfo, UserInfoParams } from "../interfaces";

export default async function getAutoDayData(
  options: UserInfoParams, model?: AutoDays
): Promise<AutoDayInfo> {
  const autoDaysItem = model ?? await AutoDays.findOne({
    where: { userId: options.userId },
  });
  if (autoDaysItem === null) {
    return {
      userId: options.userId,
      onSunday: false,
      onMonday: true,
      onTuesday: true,
      onWednesday: true,
      onThursday: true,
      onFriday: true,
      onSaturday: false,
    };
  } else {
    return {
      userId: autoDaysItem.userId,
      onSunday: autoDaysItem.onSunday,
      onMonday: autoDaysItem.onMonday,
      onTuesday: autoDaysItem.onTuesday,
      onWednesday: autoDaysItem.onWednesday,
      onThursday: autoDaysItem.onThursday,
      onFriday: autoDaysItem.onFriday,
      onSaturday: autoDaysItem.onSaturday,
    };
  }
}
