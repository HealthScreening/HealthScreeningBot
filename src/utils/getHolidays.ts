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
import { DateTime } from "luxon";

import { holidayData } from "../data/holidays.json";

export interface Date {
  year: number;
  month: number;
  day: number;
}

export interface Holiday {
  start: Date;
  end?: Date;
  name: string;
}

const holidays: Holiday[] = holidayData;

export default function dayIsHoliday(date: Date): Holiday | null {
  const targetDateTime = DateTime.local(date.year, date.month, date.day, {
    zone: "America/New_York",
  });
  const targetTimeMillis = targetDateTime.toMillis();
  const holiday = holidays
    .map((value) => {
      return {
        start: value.start,
        end: value.end || value.start,
        name: value.name,
      };
    })
    .find((holidayItem) => {
      const start = DateTime.local(
        holidayItem.start.year,
        holidayItem.start.month,
        holidayItem.start.day,
        0,
        0,
        0,
        {
          zone: "America/New_York",
        }
      );
      const end = DateTime.local(
        holidayItem.end.year,
        holidayItem.end.month,
        holidayItem.end.day,
        23,
        59,
        59,
        {
          zone: "America/New_York",
        }
      );
      return (
        start.toMillis() <= targetTimeMillis &&
        targetTimeMillis <= end.toMillis()
      );
    });
  return holiday || null;
}
