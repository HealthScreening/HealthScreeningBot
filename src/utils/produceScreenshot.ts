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
import * as Buffer from "buffer";
import { DateTime } from "luxon";

import completeScreening, {
  SendRequestParams,
} from "@healthscreening/complete-screening";
import generateScreenshot, {
  GetScreenshotParams,
} from "@healthscreening/generate-screenshot";
import screeningTypes from "@healthscreening/screening-types";

export interface GenerateScreenshotParams extends SendRequestParams {
  device: string;
}

export async function sendRequestAndGenerateScreenshot(
  options: GenerateScreenshotParams
): Promise<Buffer> {
  // We assume the browser has been started already.
  const successful = await completeScreening(options);
  if (!successful) {
    throw new Error("Failed to send the request.");
  }
  const pageParamObj: GetScreenshotParams = {
    type: screeningTypes[options.type || "G"],
    name: options.firstName + " " + options.lastName,
    date: DateTime.now().setZone("America/New_York").toFormat("DDDD t"),
    device: options.device,
  };
  return await generateScreenshot(pageParamObj);
}
