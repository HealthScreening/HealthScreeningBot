import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { DateTime } from "luxon";
import { Op } from "sequelize";

import { Subcommand } from "../../client/command";
import { CommandLog } from "../../orm/commandLog";

export default class CommandViewCommand extends Subcommand {
  registerSubcommand(
    subcommand: SlashCommandSubcommandBuilder
  ): SlashCommandSubcommandBuilder {
    return subcommand
      .setName("view")
      .setDescription("View an individual command log entry")
      .addIntegerOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the command log entry to view.")
          .setRequired(true)
      )
      .addBooleanOption((option) =>
        option
          .setName("ephemeral")
          .setDescription("Whether the contents are hidden to everyone else")
          .setRequired(false)
      );
  }
  async execute(interaction: CommandInteraction) {
    const id: number = interaction.options.getInteger("id", true);
    const ephemeral =
      interaction.options.getBoolean("ephemeral", false) ?? true;
    const item: CommandLog | null = await CommandLog.findOne({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
    if (!item) {
      return await interaction.reply({
        content: "No command log entry with that ID found.",
        ephemeral,
      });
    }
    const embed = new MessageEmbed();
    embed.setTitle("Command Log Entry #" + item.id);
    embed.addFields([
      {
        name: "Command Name",
        value: item.commandName,
        inline: false,
      },
      {
        name: "User",
        value: `<@${item.userId}> (${item.userName})`,
        inline: false,
      },
    ]);
    embed.addField(
      "Date",
      DateTime.fromMillis(item.createdAt.getTime()).toLocaleString(
        DateTime.DATETIME_HUGE_WITH_SECONDS
      ),
      false
    );
    return await interaction.reply({
      embeds: [embed],
      ephemeral,
    });
  }
}
