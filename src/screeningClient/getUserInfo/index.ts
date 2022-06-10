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
