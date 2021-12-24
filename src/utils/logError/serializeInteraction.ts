import { AutocompleteInteraction, CommandInteraction, CommandInteractionOption } from "discord.js";

export default function serializeInteraction(
  interaction: CommandInteraction | AutocompleteInteraction
): object {
  return {
    command: {
      base: interaction.commandName,
      subcommandGroup: interaction.options.getSubcommandGroup(false),
      subcommand: interaction.options.getSubcommand(false),
    },
    arguments: interaction.options.data.map(
      (item: CommandInteractionOption) => {
        let value;
        switch (item.type) {
          case "USER":
            value = item.user!.id;
            break;
          case "CHANNEL":
            value = item.channel!.id;
            break;
          case "ROLE":
            value = item.role!.id;
            break;
          case "MENTIONABLE":
            value = (item.user || item.role || item.channel)!.id;
            break;
          default:
            value = item.value;
            break;
        }
        return {
          name: item.name,
          type: item.type,
          value,
          focused: item.focused,
          autocomplete: item.autocomplete,
        };
      }
    ),
    user: interaction.user.id,
    channel: interaction.channel?.id || null,
    guild: interaction.guild?.id || null,
  };
}
