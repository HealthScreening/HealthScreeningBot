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
import { WorkerQueue } from "./utils/workerQueue";
import {
  generateScreenshot,
  GenerateScreenshotParams,
} from "./utils/produce_screenshot";
import { ItemType, MessageOptions, sendMessage } from "./utils/multiMessage";
import { Config } from "./orm";
import { TextChannel, User } from "discord.js";
import { DateTime } from "luxon";

export interface AutoBatchOptions {
  batchTime: [number, number];
  itemNumber: number;
  logChannel: TextChannel;
}

/**
 * This consists of three parts: <ul>
 *  <li>auto: The auto parameters. This consists of two parts: <ul>
 *      <li>isAuto: Whether or not the bot is in auto mode.</li>
 *      <li>isManualAuto: Whether or not the bot is in manual auto mode.</li></ul></li>
 *  <li>generateScreenshotParams: The parameters required for generating a screenshot.</li>
 *  <li>multiMessageParams: The parameters required for sending a message.</li></ul>
 */
export interface ProcessParams {
  generateScreenshotParams: GenerateScreenshotParams;
  multiMessageParams: MessageOptions;
  auto?: AutoBatchOptions;
  cooldownId?: string;
}

/**
 * Possible user info that is possible to obtain.
 */
export interface UserInfo {
  userId: string;
  auto?: {
    firstName: string;
    lastName: string;
    email: string;
    vaccinated: boolean;
    time: {
      hour: number;
      minute: number;
    };
  };
  device: string;
}

/**
 * The class that forms a bridge between the Discord component and the screening component of the bot.
 *
 * This class houses the queue and cooldowns so that it is not necessary to pass them as arguments.
 */
export class ScreeningClient {
  private readonly queue: WorkerQueue<ProcessParams, void> = new WorkerQueue({
    worker: this.process.bind(this),
    limit: 4,
  });
  private readonly cooldowns: Set<string> = new Set();

  /**
   * Actually processes a screening request.
   *
   * @param params The parameters required for processing.
   * @private
   */
  private async process(params: ProcessParams) {
    try {
      const start = DateTime.local({
        locale: "en_US",
        zone: "America/New_York",
      }).toMillis();
      let success = true;
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
        const finish =
          DateTime.local({
            locale: "en_US",
            zone: "America/New_York",
          }).toMillis() - start;
        try {
          await sendMessage(messageParams);
        } catch (e) {
          // Most likely user who disabled DMs, so we will not log the full error.
          console.error(
            `Failed to send message to user ${
              messageParams.item.id
            } with error ${e.message || e}`
          );
          success = false;
        }
        if (success) {
          params.auto?.logChannel.send(
            `Finished screening **${params.auto.batchTime[0]}:${
              params.auto.batchTime[1]
            }::${params.auto.itemNumber}** in ${(finish / 1000).toFixed(
              2
            )} seconds`
          );
        }
      } catch (e) {
        success = false;
        console.error(e);
      }
      if (!success) {
        params.auto?.logChannel.send(
          `Failed screening **${params.auto.batchTime[0]}:${params.auto.batchTime[1]}::${params.auto.itemNumber}**`
        );
      }
      if (params.cooldownId) {
        this.clearCooldown(params.cooldownId);
      }
    } catch (e) {
      if (params.auto) {
        console.error(e);
      } else {
        throw e;
      }
    }
  }

  private static async getUserInfo(options: {
    userId: string;
    errorOnInvalid?: MessageOptions;
  }): Promise<UserInfo | null> {
    const configItem = await Config.findOne({
      where: { userId: options.userId },
    });
    if (configItem === null) {
      if (options.errorOnInvalid) {
        const messageParams: MessageOptions = {
          content:
            "You do not have any auto information stored! Use `/set_auto` to set some information.",
          ephemeral: true,
          ...options.errorOnInvalid,
        };
        await sendMessage(messageParams);
        return null;
      } else {
        return {
          userId: options.userId,
          device: "iPhone 11",
        };
      }
    } else {
      return {
        userId: options.userId,
        auto: {
          firstName: configItem.firstName,
          lastName: configItem.lastName,
          email: configItem.email,
          vaccinated: configItem.vaccinated,
          time: {
            hour: configItem.timeHours,
            minute: configItem.timeMinutes,
          },
        },
        device: configItem.device,
      };
    }
  }

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

  private clearCooldown(userId: string) {
    setTimeout(() => {
      this.cooldowns.delete(userId);
    }, 60 * 1000);
  }

  private async dealWithQueue(params: ProcessParams) {
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
    await this.queue.enqueue(params, 1);
  }

  public async queueAutoCommand(
    userId: string,
    multiMessageParams: MessageOptions
  ): Promise<void> {
    if (!this.processCooldowns(userId, multiMessageParams)) {
      return;
    }
    const userInfo = await ScreeningClient.getUserInfo({
      userId: userId,
      errorOnInvalid: multiMessageParams,
    });
    if (userInfo === null) {
      return;
    }
    const processParams: ProcessParams = {
      generateScreenshotParams: {
        firstName: userInfo.auto.firstName,
        lastName: userInfo.auto.lastName,
        email: userInfo.auto.email,
        isVaxxed: userInfo.auto.vaccinated,
      },
      multiMessageParams: {
        ...multiMessageParams,
        content: `<@${userId}>, here is the screenshot that you requested:`,
      },
    };
    await this.dealWithQueue(processParams);
  }

  public async queueOnceCommand(userId: string, params: ProcessParams): Promise<void> {
    if (!this.processCooldowns(userId, params.multiMessageParams)) {
      return;
    }
    const userInfo = await ScreeningClient.getUserInfo({
      userId: userId,
    });
    const processParams: ProcessParams = {
      generateScreenshotParams: {
        ...params.generateScreenshotParams,
        deviceName: userInfo.device,
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
    const userInfo = (await ScreeningClient.getUserInfo({
      userId: user.id,
    }));
    let content =
      "If you enjoyed the bot, please share this server with your friends!: https://discord.gg/yJbvcD4QBP\n----\nHere is the screenshot that has been auto-generated for you:";
    if (auto.manual) {
      content =
        "**The auto health screening has been *manually triggered* by the bot owner, most likely for testing.**\n----\n" +
        content;
    }
    const processParams: ProcessParams = {
      generateScreenshotParams: {
        firstName: userInfo.auto.firstName,
        lastName: userInfo.auto.lastName,
        email: userInfo.auto.email,
        isVaxxed: userInfo.auto.vaccinated,
        deviceName: userInfo.device,
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
