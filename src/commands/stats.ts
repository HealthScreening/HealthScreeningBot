import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
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

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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
    const embed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Bot Stats")
      .setAuthor({
        name: "Auto Health Screening",
        iconURL:
          "https://cdn.discordapp.com/icons/889983763994521610/43fc775c6dbce5cf84b76f54e8bf5729.webp",
      })
      .addFields([
        {
          name: "Servers",
          value: String(guildSize),
          inline: true,
        },
        {
          name: "Total Members in All Servers",
          value: String(members),
          inline: true,
        },
        {
          name: "People Registered for Auto Screenings",
          value: String(registeredPeople),
        },
        {
          name: "Unique Screening Times",
          value: String(timeCounts.length),
          inline: true,
        },
      ])
      .setTimestamp(curTimeMillis);
    const detailedEmbed = new EmbedBuilder()
      .setColor("Green")
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
    const daysEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Stats: Auto Screening Days")
      .setAuthor({
        name: "Auto Health Screening",
        iconURL:
          "https://cdn.discordapp.com/icons/889983763994521610/43fc775c6dbce5cf84b76f54e8bf5729.webp",
      })
      .addFields([
        { name: "Sunday", value: String(onSunday), inline: true },
        { name: "Monday", value: String(onMonday), inline: true },
        { name: "Tuesday", value: String(onTuesday), inline: true },
        { name: "Wednesday", value: String(onWednesday), inline: true },
        { name: "Thursday", value: String(onThursday), inline: true },
        { name: "Friday", value: String(onFriday), inline: true },
        { name: "Saturday", value: String(onSaturday), inline: true },
      ])
      .setTimestamp(curTimeMillis);
    const embeds = [embed, detailedEmbed, daysEmbed];
    await new Paginator(embeds).send({
      itemType: ItemType.interaction,
      item: interaction,
    });
  }
}
