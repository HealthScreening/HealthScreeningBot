import {
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  CommandInteractionOption,
} from "discord.js";

export default function serializeInteraction(
  interaction: ChatInputCommandInteraction | AutocompleteInteraction
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
          case ApplicationCommandOptionType.User:
            value = item.user!.id;
            break;
          case ApplicationCommandOptionType.Channel:
            value = item.channel!.id;
            break;
          case ApplicationCommandOptionType.Role:
            value = item.role!.id;
            break;
          case ApplicationCommandOptionType.Mentionable:
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
