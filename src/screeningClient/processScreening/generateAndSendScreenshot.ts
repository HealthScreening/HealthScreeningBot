import { ActionRow } from "discord.js";

import { AutoUser } from "../../orm/autoUser";
import getPresetButton from "../../utils/buttonPresets";
import logError from "../../utils/logError";
import {
  ItemType,
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
    if (messageParams.itemType === ItemType.user) {
      messageParams.components = [
        new ActionRow().addComponents(getPresetButton("delete")),
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
