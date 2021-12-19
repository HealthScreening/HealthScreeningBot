import { DateTime } from "luxon";
import { holidayData } from "../../holidays.json";

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
    .find((holiday) => {
      const start = DateTime.local(
        holiday.start.year,
        holiday.start.month,
        holiday.start.day,
        0,
        0,
        0,
        {
          zone: "America/New_York",
        }
      );
      const end = DateTime.local(
        holiday.end.year,
        holiday.end.month,
        holiday.end.day,
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
