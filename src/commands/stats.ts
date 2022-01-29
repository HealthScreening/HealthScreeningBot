/**
 * Copyright (C) 2021-2022 PythonCoderAS
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
import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";

import { Command } from "../client/command";
import { AutoDays } from "../orm/autoDays";
import { AutoUser } from "../orm/autoUser";
import { ItemType } from "../utils/multiMessage";
import Paginator from "../utils/paginator";

export default class Stats extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Get bot stats.");
  async execute(interaction: CommandInteraction) {
    const guildSize = interaction.client.guilds.cache.size;
    let members = 0;
    interaction.client.guilds.cache.forEach((value) => {
      members += value.memberCount;
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Sequelize provides incorrect types to us.
    const timeCounts: { hour: number; minute: number; count: number }[] =
      await AutoUser.count({
        group: ["hour", "minute"],
      });
    const registeredPeople = timeCounts
      .map((value) => value.count)
      .reduce((a, b) => a + b, 0);
    const curTimeMillis = DateTime.local().toUTC().toMillis();
    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Bot Stats")
      .setAuthor({
        name: "Auto Health Screening",
        iconURL:
          "https://cdn.discordapp.com/icons/889983763994521610/43fc775c6dbce5cf84b76f54e8bf5729.webp",
      })
      .addField("Servers", String(guildSize), true)
      .addField("Total Members in All Servers", String(members), true)
      .addField(
        "People Registered for Auto Screenings",
        String(registeredPeople)
      )
      .addField("Unique Screening Times", String(timeCounts.length), true)
      .setTimestamp(curTimeMillis);
    const detailedEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Stats: Auto Screening Times")
      .setAuthor({
        name: "Auto Health Screening",
        iconURL:
          "https://cdn.discordapp.com/icons/889983763994521610/43fc775c6dbce5cf84b76f54e8bf5729.webp",
      })
      .setDescription(
        timeCounts
          .sort((a, b) => {
            const aTotalMinutes = a.hour * 60 + a.minute;
            const bTotalMinutes = b.hour * 60 + b.minute;
            return aTotalMinutes - bTotalMinutes;
          })
          .map((value) => {
            const hour12 = value.hour % 12 || 12;
            const isPM = value.hour >= 12;
            const minutePadded = String(value.minute).padStart(2, "0");
            return `**${
              value.hour
            }:${minutePadded}** (**${hour12}:${minutePadded} ${
              isPM ? "PM" : "AM"
            }**): ${value.count}`;
          })
          .join("\n")
      )
      .setTimestamp(curTimeMillis);
    const autoDays = await AutoDays.findAll();
    const onSunday = autoDays.filter((value) => value.onSunday).length;
    const onMonday = autoDays.filter((value) => value.onMonday).length;
    const onTuesday = autoDays.filter((value) => value.onTuesday).length;
    const onWednesday = autoDays.filter((value) => value.onWednesday).length;
    const onThursday = autoDays.filter((value) => value.onThursday).length;
    const onFriday = autoDays.filter((value) => value.onFriday).length;
    const onSaturday = autoDays.filter((value) => value.onSaturday).length;
    const daysEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Stats: Auto Screening Days")
      .setAuthor({
        name: "Auto Health Screening",
        iconURL:
          "https://cdn.discordapp.com/icons/889983763994521610/43fc775c6dbce5cf84b76f54e8bf5729.webp",
      })
      .addField("Sunday", String(onSunday), true)
      .addField("Monday", String(onMonday), true)
      .addField("Tuesday", String(onTuesday), true)
      .addField("Wednesday", String(onWednesday), true)
      .addField("Thursday", String(onThursday), true)
      .addField("Friday", String(onFriday), true)
      .addField("Saturday", String(onSaturday), true)
      .setTimestamp(curTimeMillis);
    const embeds = [embed, detailedEmbed, daysEmbed];
    await new Paginator(embeds).send({
      itemType: ItemType.interaction,
      item: interaction,
    });
  }
}
