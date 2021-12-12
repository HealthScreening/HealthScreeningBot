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
import { ProcessParams } from "../interfaces";
import timeMethod from "../../utils/timeMethod";
import generateAndSendScreenshot from "./generateAndSendScreenshot";
import logSuccess from "./logSuccess";
import processCooldown from "./processCooldown";
import sendRequest from "../../utils/produceScreenshot/sendRequest";

/**
 * Actually processes a screening request.
 *
 * @param params The parameters required for processing.
 * @private
 */
export default async function processScreening(params: ProcessParams) {
  try {
    let success: boolean, finish: number;
    if (params.auto && !params.auto.dmScreenshot) {
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
      console.error(e);
    } else {
      throw e;
    }
  }
}
