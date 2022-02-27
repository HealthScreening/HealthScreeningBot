import { Devices } from "../../orm/devices";
import { DeviceInfo, UserInfoParams } from "../interfaces";

export default async function getDeviceData(
  options: UserInfoParams,
  model?: Devices
): Promise<DeviceInfo> {
  const autoDaysItem =
    model ??
    (await Devices.findOne({
      where: { userId: options.userId },
    }));
  return {
    userId: options.userId,
    device: autoDaysItem?.device || "iPhone 11",
  };
}
