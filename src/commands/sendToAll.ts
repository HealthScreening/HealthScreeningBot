import { SlashCommandBuilder } from "@discordjs/builders";
import {
  AutocompleteInteraction,
  Collection,
  MessageEmbed,
  User,
} from "discord.js";
import sleep from "sleep-promise";

import { Command } from "../client/command";
import { HSBCommandInteraction } from "../discordjs-overrides";
import { AutoUser } from "../orm/autoUser";
import checkOwner from "../utils/checkOwner";
import logError from "../utils/logError";
import { ItemType } from "../utils/multiMessage";
import nameAutocomplete from "./guide/autocomplete/name";

export default class SendToAll extends Command {
  public autocompleteFields: Collection<
    string,
    (interaction: AutocompleteInteraction) => Promise<void>
  > = new Collection(
    Object.entries({
      guide_name: nameAutocomplete,
    })
  );
  public readonly data = new SlashCommandBuilder()
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
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("guide_name")
        .setDescription("The name of the guide to send")
        .setRequired(false)
        .setAutocomplete(true)
    ) as SlashCommandBuilder;
  async execute(interaction: HSBCommandInteraction) {
    if (
      await checkOwner({ item: interaction, itemType: ItemType.interaction })
    ) {
      const timeToSleep = interaction.options.getInteger("time") || 0;
      await interaction.reply("Sending to all...");
      const items = await AutoUser.findAll();
      const guideName = interaction.options.getString("guide_name");
      const message: string =
        "The bot owner has sent a message to everyone registered under the auto health screening bot:\n----\n" +
        interaction.options.getString("message") +
        "\n----\nIf you have any questions, contact <@199605025914224641> (PokestarFan#8524).";
      let embeds: MessageEmbed[] | undefined = undefined;
      if (guideName) {
        if (!interaction.client.guideData.has(guideName)) {
          await interaction.reply({
            content:
              "The guide you requested does not exist. Please try again.",
            ephemeral: true,
          });
          return;
        } else {
          embeds = interaction.client.guideData.get(guideName)!;
        }
      }
      let user: User;
      if (timeToSleep === 0) {
        let batchData: Promise<void>[] = [];
        for (const item of items) {
          batchData.push(
            (async () => {
              try {
                user = await interaction.client.users.fetch(item.userId);
                await user.send({
                  content: message,
                  embeds,
                });
              } catch (e) {
                console.log(e);
              }
            })()
          );
          if (batchData.length >= 10) {
            await Promise.all(batchData);
            batchData = [];
          }
        }
        if (batchData.length > 0) {
          await Promise.all(batchData);
        }
      } else {
        for (const item of items) {
          try {
            user = await interaction.client.users.fetch(item.userId);
            await user.send({
              content: message,
              embeds,
            });
            await sleep(timeToSleep * 1000);
          } catch (e) {
            await logError(e, "sendToAll", {
              userId: item.userId,
              message,
            });
          }
        }
      }
    }
  }
}
