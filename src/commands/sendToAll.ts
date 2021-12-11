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
import { CommandInteraction, User } from "discord.js";
import { Config } from "../orm";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send_to_all")
    .setDescription("Send a message to every person registered in the bot.")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The message to send")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("time")
        .setDescription(
          "The amount of time to wait between messages (in seconds)"
        )
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    if (interaction.user.id != "199605025914224641") {
      interaction.reply({
        content: "You are not the bot owner!",
        ephemeral: true,
      });
    } else {
      const timeToSleep = interaction.options.getInteger("time");
      await interaction.reply("Sending to all...");
      const validUserIDs = new Set();
      for (const [, guild] of interaction.client.guilds.cache) {
        for (const [userId] of await guild.members.fetch()) {
          validUserIDs.add(userId);
        }
      }
      const items = await Config.findAll();
      const message =
        "The bot owner has sent a message to everyone registered under the auto health screening bot:\n----\n" +
        interaction.options.getString("message") +
        "\n----\nIf you have any questions, contact <@199605025914224641> (PokestarFan#8524).";
      let user: User;
      for (const item of items) {
        try {
          if (!validUserIDs.has(item.userId)) {
            continue;
          }
          user = await interaction.client.users.fetch(item.userId);
          await user.send({
            content: message,
          });
          await sleep(timeToSleep * 1000);
        } catch (e) {
          console.error(e);
        }
      }
    }
  },
};
