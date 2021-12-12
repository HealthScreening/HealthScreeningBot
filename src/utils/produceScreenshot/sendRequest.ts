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
import axios from "axios";
import { objectToWrapper } from "../objectToWrapper";
import { SendRequestParams, SubmitParams } from "./interfaces";

export default async function sendRequest(
  options: SendRequestParams
): Promise<boolean> {
  // We assume the browser has been started already.

  const obj: SubmitParams = {
    Type: options.type || "G",
    IsOther: false,
    IsStudent: 1,
    FirstName: options.firstName,
    LastName: options.lastName,
    Email: options.email,
    State: "NY",
    Location: "X445",
    Floor: null,
    Answer1: 0,
    Answer2: 0,
  };
  if (options.isVaxxed) {
    obj.Answer3 = 0;
    obj.Answer4 = 0;
  } else {
    obj.Answer3 = 1;
  }
  const response = await axios.post(
    "https://healthscreening.schools.nyc/home/submit",
    new URLSearchParams(objectToWrapper(obj)).toString(),
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,bn;q=0.8",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    }
  );
  return response.status / 100 < 4;
}
