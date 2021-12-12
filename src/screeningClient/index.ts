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
import { WorkerQueue } from "../utils/workerQueue";
import { ItemType, MessageOptions, sendMessage } from "../utils/multiMessage";
import { AutoBatchOptions, AutoInfo, ProcessParams } from "./interfaces";
import { User } from "discord.js";
import processScreening from "./processScreening";
import getAutoData from "./getUserInfo/getAutoData";
import getDeviceData from "./getUserInfo/getDeviceData";

/**
 * The class that forms a bridge between the Discord component and the screening component of the bot.
 *
 * This class houses the queue and cooldowns so that it is not necessary to pass them as arguments.
 */
export class ScreeningClient {
  private readonly queue: WorkerQueue<ProcessParams, void> = new WorkerQueue({
    worker: processScreening,
    limit: 8, // New limit because we have a much easier time with the queue.
  });
  private readonly cooldowns: Set<string> = new Set();

  private processCooldowns(
    userId: string,
    sendMessageOptions: MessageOptions
  ): boolean {
    if (this.cooldowns.has(userId)) {
      const messageOptions = {
        content:
          "You are on cooldown! Please wait a minute before using this command again.",
        ephemeral: true,
        ...sendMessageOptions,
      };
      sendMessage(messageOptions);
      return false;
    } else {
      this.cooldowns.add(userId);
      return true;
    }
  }

  private async dealWithQueue(params: ProcessParams, userId: string) {
    if (this.queue.willQueue()) {
      const messageOptions: MessageOptions = {
        content:
          "Your request has been queued! You will be notified when the screening is ready. You are currently at position " +
          this.queue.determineNextPosition(1) +
          " in the queue.",
        ...params.multiMessageParams,
      };
      sendMessage(messageOptions);
    } else if (params.multiMessageParams.itemType === ItemType.interaction) {
      await params.multiMessageParams.item.deferReply();
    }
    const trueParams: ProcessParams = {
      ...params,
      cooldown: {
        container: this.cooldowns,
        id: userId,
      },
    };
    await this.queue.enqueue(trueParams, 1);
  }

  public async queueAutoCommand(
    userId: string,
    multiMessageParams: MessageOptions
  ): Promise<void> {
    const autoInfo = await getAutoData({
      userId: userId,
      errorOnInvalid: multiMessageParams,
    });
    const deviceInfo = await getDeviceData({ userId: userId });
    if (autoInfo === null) {
      return;
    }
    if (!this.processCooldowns(userId, multiMessageParams)) {
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
    await this.dealWithQueue(processParams, userId);
  }

  public async queueOnceCommand(
    userId: string,
    params: ProcessParams
  ): Promise<void> {
    if (!this.processCooldowns(userId, params.multiMessageParams)) {
      return;
    }
    const deviceInfo = await getDeviceData({ userId: userId });
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
    await this.dealWithQueue(processParams, userId);
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
      "If you enjoyed the bot, please share this server with your friends!: https://discord.gg/yJbvcD4QBP\n----\nHere is the screenshot that has been auto-generated for you:";
    if (auto.manual) {
      content =
        "**The auto health screening has been *manually triggered* by the bot owner, most likely for testing.**\n----\n" +
        content;
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
        content: content,
      },
      auto,
    };
    this.queue.enqueue(processParams, 0);
  }
}
