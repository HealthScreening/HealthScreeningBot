import { AutoUser } from "../../orm/autoUser";
import { AutoInfo, UserInfoParams } from "../interfaces";
import errorOnInvalid from "./errorOnInvalid";

export default async function getAutoData(
  options: UserInfoParams,
  model?: AutoUser
): Promise<AutoInfo | null> {
  const autoUserItem =
    model ??
    (await AutoUser.findOne({
      where: { userId: options.userId },
    }));
  if (autoUserItem === null) {
    if (options.errorOnInvalid) {
      await errorOnInvalid(options.errorOnInvalid);
    }
    return null;
  } else {
    return {
      userId: autoUserItem.userId,
      firstName: autoUserItem.firstName,
      lastName: autoUserItem.lastName,
      email: autoUserItem.email,
      vaccinated: autoUserItem.vaccinated,
      time: {
        hour: autoUserItem.hour,
        minute: autoUserItem.minute,
      },
      type: autoUserItem.type,
      emailOnly: autoUserItem.emailOnly,
      paused: autoUserItem.paused,
    };
  }
}
