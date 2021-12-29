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
import { MessageActionRow } from "discord.js";

import { AutoUser } from "../../orm/autoUser";
import getPresetButton from "../../utils/buttonPresets";
import logError from "../../utils/logError";
import {
  MessageOptions,
  getUserID,
  sendMessage,
  serializeMessageOptions,
} from "../../utils/multiMessage";
import { sendRequestAndGenerateScreenshot } from "../../utils/produceScreenshot";
import { ProcessParams, serializeProcessParams } from "../interfaces";

export default async function generateAndSendScreenshot(params: ProcessParams) {
  try {
    let screenshot;
    try {
      screenshot = await sendRequestAndGenerateScreenshot(
        params.generateScreenshotParams
      );
    } catch (e) {
      await logError(
        e,
        "generateAndSendScreenshot::generateScreenshot",
        serializeProcessParams(params)
      );
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
    if (!messageParams.ephemeral) {
      messageParams.components = [
        new MessageActionRow().addComponents(getPresetButton("delete")),
      ];
    }
    try {
      await sendMessage(messageParams);
    } catch (e) {
      if (
        e.name === "DiscordAPIError" &&
        e.message === "Cannot send messages to this user"
      ) {
        // We want to catch the error
        if (!params.auto) {
          // If it's not auto, then pass the error along to the caller
          throw e;
        }
        // Set to email only
        const userId = getUserID(messageParams);
        const autoUserObj = await AutoUser.findOne({ where: { userId } });
        if (autoUserObj === null) {
          return false;
        }
        autoUserObj.emailOnly = true;
        await autoUserObj.save();
      } else {
        await logError(
          e,
          "generateAndSendScreenshot::sendMessage",
          serializeMessageOptions(messageParams)
        );
        return false;
      }
    }
    return true;
  } catch (e) {
    // If it's not auto, then pass the error along to the caller
    if (!params.auto) {
      throw e;
    }
    await logError(
      e,
      "generateAndSendScreenshot",
      serializeProcessParams(params)
    );
    return false;
  }
}
