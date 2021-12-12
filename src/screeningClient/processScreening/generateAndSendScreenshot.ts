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
import { generateScreenshot } from "../../utils/produceScreenshot";
import { MessageOptions, sendMessage } from "../../utils/multiMessage";

export default async function generateAndSendScreenshot(params: ProcessParams) {
  try {
    const screenshot = await generateScreenshot(
      params.generateScreenshotParams
    );
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
    await sendMessage(messageParams);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}
