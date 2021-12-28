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
import { AutoDays } from "../orm/autoDays";

export default async function getUsersForDayOfWeek(
  dayOfWeek: number
): Promise<string[]> {
  const whereData: Record<string, boolean> = {};
  switch (dayOfWeek) {
    case 1:
      whereData.onMonday = true;
      break;
    case 2:
      whereData.onTuesday = true;
      break;
    case 3:
      whereData.onWednesday = true;
      break;
    case 4:
      whereData.onThursday = true;
      break;
    case 5:
      whereData.onFriday = true;
      break;
    case 6:
      whereData.onSaturday = true;
      break;
    case 7:
      whereData.onSunday = true;
      break;
  }
  return (
    await AutoDays.findAll({
      where: whereData,
    })
  ).map((autoDay) => autoDay.userId);
}
