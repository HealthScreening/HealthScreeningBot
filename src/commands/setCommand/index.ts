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
import { SlashCommandBuilder } from "@discordjs/builders";
import screeningTypes, {
  screeningTypeType,
} from "@healthscreening/screening-types";
import { AutocompleteInteraction, Collection, User } from "discord.js";
import { devices } from "puppeteer";
import createOrUpdate from "../../utils/createOrUpdate";
import { Devices, DevicesAttributes } from "../../orm/devices";
import { AutoUser } from "../../orm/autoUser";
import { ItemType } from "../../utils/multiMessage";
import { HSBCommandInteraction } from "../../discordjs-overrides";
import { AutoDays } from "../../orm/autoDays";
import { Command } from "../../client/command";
import generateNumberChoicesInRange from "../../utils/generateNumberChoicesInRange";
import devicesAutocomplete from "./autocomplete/devices";
import minuteAutocomplete from "./autocomplete/minute";

export default class SetCommand extends Command {
  public autocompleteFields: Collection<
    string,
    (interaction: AutocompleteInteraction) => Promise<void>
  > = new Collection(
    Object.entries({
      device: devicesAutocomplete,
      minute: minuteAutocomplete,
    })
  );
  public readonly data = new SlashCommandBuilder()
    .setName("set")
    .setDescription("Set optional health screening data")
    .addStringOption((option) =>
      option
        .setName("device")
        .setDescription("The name of the device to use.")
        .setRequired(false)
        .setAutocomplete(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("hour")
        .setDescription(
          "The hour to run the screening at. Must a number in the range 0-23."
        )
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(23)
        .addChoices(generateNumberChoicesInRange(0, 23))
    )
    .addIntegerOption((option) =>
      option
        .setName("minute")
        .setDescription(
          "The minute to run the screening at. Must a number in the range 0-59."
        )
        .setRequired(false)
        .setAutocomplete(true)
        .setMinValue(0)
        .setMaxValue(59)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription(
          "The type of screening to generate. Defaults to 'Guest'."
        )
        .setRequired(false)
        .addChoices(
          Object.entries(screeningTypes).map(([key, value]) => [value, key])
        )
    )
    .addBooleanOption((option) =>
      option
        .setName("email_only")
        .setDescription(
          "Whether the screening should be email only (meaning a screenshot is not DMed to you)."
        )
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("paused")
        .setDescription("Whether auto screenings should be paused.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("sunday")
        .setDescription("Whether to run the screening on Sunday.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("monday")
        .setDescription("Whether to run the screening on Monday.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("tuesday")
        .setDescription("Whether to run the screening on Tuesday.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("wednesday")
        .setDescription("Whether to run the screening on Wednesday.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("thursday")
        .setDescription("Whether to run the screening on Thursday.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("friday")
        .setDescription("Whether to run the screening on Friday.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("saturday")
        .setDescription("Whether to run the screening on Saturday.")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription(
          "Whether or not the contents are hidden to everyone else."
        )
        .setRequired(false)
    ) as SlashCommandBuilder;
  async execute(interaction: HSBCommandInteraction) {
    const validDevices = Object.keys(devices);
    const deviceName = interaction.options.getString("device");
    const hour = interaction.options.getInteger("hour");
    const minute = interaction.options.getInteger("minute");
    const type = interaction.options.getString("type");
    const emailOnly = interaction.options.getBoolean("email_only");
    const paused = interaction.options.getBoolean("paused");
    const sunday = interaction.options.getBoolean("sunday");
    const monday = interaction.options.getBoolean("monday");
    const tuesday = interaction.options.getBoolean("tuesday");
    const wednesday = interaction.options.getBoolean("wednesday");
    const thursday = interaction.options.getBoolean("thursday");
    const friday = interaction.options.getBoolean("friday");
    const saturday = interaction.options.getBoolean("saturday");
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    let foundDeviceName: string | undefined;
    if (deviceName) {
      foundDeviceName = validDevices.find(
        (device) => device.toLowerCase() == deviceName.toLowerCase()
      );
      if (!foundDeviceName) {
        return await interaction.reply({
          content:
            "Invalid device name! Please enter a valid device name. Use the autocomplete options to find a valid device name.",
          ephemeral: true,
        });
      }
    }
    const userOptions = await AutoUser.findOne({
      where: {
        userId: interaction.user.id,
      },
    });
    const dayOptions = await AutoDays.findOne({
      where: {
        userId: interaction.user.id,
      },
    });
    if (
      (!userOptions && (hour || minute || type || emailOnly || paused)) ||
      (!dayOptions &&
        (sunday ||
          monday ||
          tuesday ||
          wednesday ||
          thursday ||
          friday ||
          saturday))
    ) {
      return await interaction.reply({
        content:
          "You must first auto information using the `/set_auto` command.",
        ephemeral: true,
      });
    }
    if (hour && (hour < 0 || hour > 23)) {
      return await interaction.reply({
        content:
          "Invalid hour! Please enter a valid hour in the range [0, 23].",
        ephemeral: true,
      });
    }
    if (minute && (minute < 0 || minute > 59)) {
      return await interaction.reply({
        content:
          "Invalid minute! Please enter a valid minute in the range [0, 59].",
        ephemeral: true,
      });
    }
    if (foundDeviceName) {
      await createOrUpdate<Devices, DevicesAttributes, DevicesAttributes>(
        Devices,
        {
          userId: interaction.user.id,
          device: foundDeviceName,
        },
        { userId: interaction.user.id }
      );
    }
    if (userOptions) {
      if (hour) {
        userOptions.hour = hour;
      }
      if (minute) {
        userOptions.minute = minute;
      }
      if (type) {
        userOptions.type = type as screeningTypeType;
      }
      if (emailOnly !== null) {
        userOptions.emailOnly = emailOnly;
      }
      if (paused !== null) {
        userOptions.paused = paused;
      }
      await userOptions.save();
    }
    if (dayOptions) {
      if (sunday !== null) {
        dayOptions.onSunday = sunday;
      }
      if (monday !== null) {
        dayOptions.onMonday = monday;
      }
      if (tuesday !== null) {
        dayOptions.onTuesday = tuesday;
      }
      if (wednesday !== null) {
        dayOptions.onWednesday = wednesday;
      }
      if (thursday !== null) {
        dayOptions.onThursday = thursday;
      }
      if (friday !== null) {
        dayOptions.onFriday = friday;
      }
      if (saturday !== null) {
        dayOptions.onSaturday = saturday;
      }
      await dayOptions.save();
    }
    await interaction.reply({
      content: "Successfully set new information!",
      ephemeral,
    });
    if (userOptions && emailOnly === false) {
      await interaction.followUp({
        content:
          "To confirm that email-only mode will work, the bot will attempt to send a test screenshot.",
        ephemeral,
      });
      try {
        const user: User = interaction.user;
        await (await user.createDM()).sendTyping();
        await interaction.client.screeningClient.queueAutoCommand(
          interaction.user.id,
          {
            itemType: ItemType.user,
            item: user,
          }
        );
      } catch (e) {
        if (
          e.name === "DiscordAPIError" &&
          e.message === "Cannot send messages to this user"
        ) {
          await interaction.followUp({
            content:
              "I cannot send you a screening, possibly due to DMs being disabled from server members. Therefore, you will be set to email-only screenings. In order to disable email-only mode, please rerun `/set` after making sure your DMs are open again.",
            ephemeral,
          });
          userOptions.emailOnly = true;
          await userOptions.save();
        } else {
          throw e;
        }
      }
    }
  }
}
