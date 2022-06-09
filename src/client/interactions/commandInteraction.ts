import { HSBCommandInteraction } from "../../discordjs-overrides";
import { CommandLog } from "../../orm/commandLog";
import handleCommandError from "../../utils/handleCommandError";
import logError from "../../utils/logError";
import serializeInteraction from "../../utils/logError/serializeInteraction";
import { ItemType } from "../../utils/multiMessage";
import { getTrueCommand } from "../resolve";

export default async function commandInteraction(
  interaction: HSBCommandInteraction
) {
  try {
    await CommandLog.create({
      userId: interaction.user.id,
      userName: `${interaction.user.username}#${interaction.user.discriminator}`,
      commandName: [
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
      ]
        .filter(Boolean)
        .join(" "),
    });

    const command = await getTrueCommand(interaction);
    if (!command) {
      return;
    }

    const toRun = command.parts.filter((item) => item.beforeExecute);
    for (const checkToRun of toRun) {
      if (!(await checkToRun.beforeExecute!(interaction))) {
        return;
      }
    }

    if (!command.resolved.execute) {
      await logError(
        new Error(`Command ${command.fullName} does not support execution`),
        "interaction::commandInteractionAutocomplete::commandDoesNotSupportExecution",
        serializeInteraction(interaction)
      );
      await handleCommandError(
        { itemType: ItemType.interaction, item: interaction },
        interaction.commandName
      );
      return;
    }

    try {
      await command.resolved.execute(interaction);
    } catch (error) {
      // Skipped because no better way to do this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata: { [k: string]: any } = serializeInteraction(interaction);
      await logError(error, "interaction::commandInteraction", metadata);
      try {
        await handleCommandError(
          { itemType: ItemType.interaction, item: interaction },
          command.fullName
        );
      } catch (e2) {
        metadata.deferred = interaction.deferred;
        metadata.replied = interaction.replied;
        await logError(
          e2,
          "interaction::commandInteraction::errorReply",
          metadata
        );
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
