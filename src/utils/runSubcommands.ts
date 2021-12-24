import { CommandInteraction } from "discord.js";
import { Command, CommandMethod, Subcommand } from "../client/interfaces";
import logError from "./logError";
import serializeInteraction from "./logError/serializeInteraction";
import handleCommandError from "./handleCommandError";
import { ItemType } from "./multiMessage";

// This function does the base level execution.
async function runSubcommand(
  parent: Command | Subcommand,
  interaction: CommandInteraction,
  method: CommandMethod = CommandMethod.EXECUTE
): Promise<void> {
  const subcommand: string | null = interaction.options.getSubcommand(false);
  if (!subcommand) {
    await logError(
      new Error(`Invalid invocation of command ${interaction.commandName}`),
      "interactionCommand::subcommandNotProvided",
      serializeInteraction(interaction)
    );
    await handleCommandError(
      { itemType: ItemType.interaction, item: interaction },
      interaction.commandName
    );
    return;
  } else {
    const subcommandObject: Subcommand | undefined =
      parent.subcommands.get(subcommand);
    if (!subcommandObject) {
      await logError(
        new Error(`Subcommand ${subcommand} not found`),
        "interactionCommand::subcommandNotFound",
        serializeInteraction(interaction)
      );
      await handleCommandError(
        { itemType: ItemType.interaction, item: interaction },
        interaction.commandName
      );
      return;
    } else {
      await subcommandObject.execute(interaction);
    }
  }
}

export default async function runSubcommands(
  command: Command,
  interaction: CommandInteraction
): Promise<void> {
  const subcommandGroup: string | null =
    interaction.options.getSubcommandGroup(false);
  if (!subcommandGroup) {
    await runSubcommand(command, interaction);
  } else {
    const foundGroup: Subcommand | undefined =
      command.subcommands.get(subcommandGroup);
    if (!foundGroup) {
      await logError(
        new Error(`Subcommand group ${subcommandGroup} not found`),
        "interactionCommand::subcommandGroupNotFound",
        serializeInteraction(interaction)
      );
      await handleCommandError(
        { itemType: ItemType.interaction, item: interaction },
        interaction.commandName
      );
      return;
    } else {
      await runSubcommand(foundGroup, interaction);
    }
  }
}
