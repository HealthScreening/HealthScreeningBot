import { Command } from "../interfaces";
import logError from "../../utils/logError";
import serializeInteraction from "../../utils/logError/serializeInteraction";
import handleCommandError from "../../utils/handleCommandError";
import { ItemType, sendMessage } from "../../utils/multiMessage";
import { HSBCommandInteraction } from "../../discordjs-overrides";

export default async function commandInteraction(interaction: HSBCommandInteraction){
  try {
    console.debug(
      "%s%s ran %s",
      interaction.user.username,
      interaction.user.discriminator,
      interaction.commandName
    );

    const command: Command | undefined = this.commands.get(
      interaction.commandName
    );

    if (!command) {
      await logError(
        new Error(`Command ${interaction.commandName} not found`),
        "interaction::commandInteraction::commandNotFound",
        serializeInteraction(interaction)
      );
      await handleCommandError(
        { itemType: ItemType.interaction, item: interaction },
        interaction.commandName
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      // Skipped because no better way to do this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata: { [k: string]: any } =
        serializeInteraction(interaction);
      await logError(error, "interaction::commandInteraction", metadata);
      try {
        await sendMessage({
          itemType: ItemType.interaction,
          item: interaction,
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } catch (e2) {
        metadata.deferred = interaction.deferred;
        metadata.replied = interaction.replied;
        await logError(e2, "interaction::commandInteraction::errorReply", metadata);
      }
    }
  } catch (e) {
    await logError(
      e,
      "interaction::commandInteraction::processing",
      serializeInteraction(interaction)
    );
  }
}