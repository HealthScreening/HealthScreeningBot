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
import { AutoUser } from "../../orm/autoUser";
import { AutoInfo, UserInfoParams } from "../interfaces";
import errorOnInvalid from "./errorOnInvalid";

export default async function getAutoData(
  options: UserInfoParams
): Promise<AutoInfo | null> {
  const autoUserItem = await AutoUser.findOne({
    where: { userId: options.userId },
  });
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
    };
  }
}
