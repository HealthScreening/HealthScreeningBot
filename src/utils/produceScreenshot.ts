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
