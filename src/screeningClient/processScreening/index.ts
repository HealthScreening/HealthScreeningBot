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
    let success: boolean;
    let finish: number;
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
