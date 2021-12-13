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
import { ProcessParams, serializeProcessParams } from "../interfaces";
import { generateScreenshot } from "../../utils/produceScreenshot";
import { MessageOptions, sendMessage } from "../../utils/multiMessage";
import logError from "../../utils/logError";
import { AlreadyLogged } from "../../utils/logError/errors";
import runFunctionOnError from "../../utils/runFunctionOnError";

export default async function generateAndSendScreenshot(params: ProcessParams) {
  try {
    let screenshot;
    try {
      screenshot = await generateScreenshot(
        params.generateScreenshotParams
      );
    } catch (e) {
      await runFunctionOnError(e, AlreadyLogged, () => logError(e, "generateAndSendScreenshot::generateScreenshot", serializeProcessParams(params)));
      return false;
    }
    const messageParams: MessageOptions = {
      content: "Here is the screenshot that you requested:",
      files: [
        {
          attachment: screenshot,
          name: "screening.jpg",
          file: screenshot,
        },
      ],
      ...params.multiMessageParams,
    };
    try {
      await sendMessage(messageParams);
    } catch (e) {
      await runFunctionOnError(e, AlreadyLogged, () => logError(e, "generateAndSendScreenshot::sendMessage", params));
      return false;
    }
    return true;
  } catch (e) {
    await runFunctionOnError(e, AlreadyLogged, () => logError(e, "generateAndSendScreenshot", serializeProcessParams(params)));
    return false;
  }
}
