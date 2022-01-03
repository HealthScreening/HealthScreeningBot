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
import sendRequest from "@healthscreening/complete-screening";

import logError from "../../utils/logError";
import timeMethod from "../../utils/timeMethod";
import { ProcessParams } from "../interfaces";
import generateAndSendScreenshot from "./generateAndSendScreenshot";
import logSuccess from "./logSuccess";
import processCooldown from "./processCooldown";

/**
 * Actually processes a screening request.
 *
 * @param params The parameters required for processing.
 */
export default async function processScreening(params: ProcessParams) {
  try {
    let success: boolean, finish: number;
    if (
      (params.emailOnly && (params.auto || params.isSetAuto)) ||
      params.auto?.dmScreenshot === false
    ) {
      [success, finish] = await timeMethod(() =>
        sendRequest(params.generateScreenshotParams)
      );
    } else {
      [success, finish] = await timeMethod(() =>
        generateAndSendScreenshot(params)
      );
    }
    await logSuccess(params, success, finish);
    processCooldown(params);
  } catch (e) {
    if (params.auto) {
      await logError(e, "dailyAutoScreening", params);
    } else {
      throw e;
    }
  }
}
