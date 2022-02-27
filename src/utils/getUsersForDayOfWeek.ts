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
