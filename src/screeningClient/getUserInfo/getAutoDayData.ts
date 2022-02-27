import { AutoDays } from "../../orm/autoDays";
import { AutoDayInfo, UserInfoParams } from "../interfaces";

export default async function getAutoDayData(
  options: UserInfoParams,
  model?: AutoDays
): Promise<AutoDayInfo> {
  const autoDaysItem =
    model ??
    (await AutoDays.findOne({
      where: { userId: options.userId },
    }));
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
