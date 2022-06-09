import ConcurrentPriorityWorkerQueue from "concurrent-priority-worker-queue";
import { User } from "discord.js";

import { ItemType, MessageOptions, sendMessage } from "../utils/multiMessage";
import getAutoData from "./getUserInfo/getAutoData";
import getDeviceData from "./getUserInfo/getDeviceData";
import { AutoBatchOptions, AutoInfo, ProcessParams } from "./interfaces";
import processScreening from "./processScreening";

/**
 * The class that forms a bridge between the Discord component and the screening component of the bot.
 *
 * This class houses the queue and cooldowns so that it is not necessary to pass them as arguments.
 */
export class ScreeningClient {
  private readonly queue: ConcurrentPriorityWorkerQueue<ProcessParams, void> =
    new ConcurrentPriorityWorkerQueue({
      worker: processScreening,
      limit: 8,
    });

  private async dealWithQueue(params: ProcessParams) {
    if (this.queue.willQueue()) {
      const messageOptions: MessageOptions = {
        content: `Your request has been queued! You will be notified when the screening is ready. You are currently at position ${this.queue.determineNextPosition(
          1
        )} in the queue.`,
        ...params.multiMessageParams,
      };
      sendMessage(messageOptions);
    } else if (params.multiMessageParams.itemType === ItemType.interaction) {
      await params.multiMessageParams.item.deferReply({
        ephemeral: params.multiMessageParams.ephemeral,
      });
    }

    const trueParams: ProcessParams = {
      ...params,
    };
    await this.queue.enqueue(trueParams, 1);
  }

  public async queueAutoCommand(
    userId: string,
    multiMessageParams: MessageOptions
  ): Promise<void> {
    const autoInfo = await getAutoData({
      userId,
      errorOnInvalid: multiMessageParams,
    });
    const deviceInfo = await getDeviceData({ userId });
    if (autoInfo === null) {
      return;
    }

    const processParams: ProcessParams = {
      generateScreenshotParams: {
        firstName: autoInfo.firstName,
        lastName: autoInfo.lastName,
        email: autoInfo.email,
        isVaxxed: autoInfo.vaccinated,
        device: deviceInfo.device,
        type: autoInfo.type,
      },
      multiMessageParams: {
        ...multiMessageParams,
        content: `<@${userId}>, here is the screenshot that you requested:`,
      },
    };
    await this.dealWithQueue(processParams);
  }

  public async queueOnceCommand(
    userId: string,
    params: ProcessParams
  ): Promise<void> {
    const deviceInfo = await getDeviceData({ userId });
    const processParams: ProcessParams = {
      generateScreenshotParams: {
        ...params.generateScreenshotParams,
        device: deviceInfo.device,
      },
      multiMessageParams: {
        ...params.multiMessageParams,
        content: `<@${userId}>, here is the screenshot that you requested:`,
      },
    };
    await this.dealWithQueue(processParams);
  }

  public async queueDailyAuto(
    user: User,
    auto: AutoBatchOptions & { manual?: boolean }
  ): Promise<void> {
    const autoInfo: AutoInfo = (await getAutoData({
      userId: user.id,
    }))!;
    const deviceInfo = await getDeviceData({ userId: user.id });
    let content =
      "Here is the screenshot that has been auto-generated for you:";
    if (auto.manual) {
      content = `**The auto health screening has been *manually triggered* by the bot owner, most likely for testing.**\n----\n${content}`;
    }

    const processParams: ProcessParams = {
      generateScreenshotParams: {
        firstName: autoInfo.firstName,
        lastName: autoInfo.lastName,
        email: autoInfo.email,
        isVaxxed: autoInfo.vaccinated,
        device: deviceInfo.device,
        type: autoInfo.type,
      },
      multiMessageParams: {
        itemType: ItemType.user,
        item: user,
        content,
      },
      auto,
      emailOnly: autoInfo.emailOnly,
    };
    this.queue.enqueue(processParams, 0);
  }
}
