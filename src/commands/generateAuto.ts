import {SlashCommandBuilder} from "@discordjs/builders";
import {discordjsOverrides} from "../discordjs-overrides";
import {ItemType} from "../utils/multiMessage";
import HSBCommandInteraction = discordjsOverrides.HSBCommandInteraction;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('generate_auto')
        .setDescription('Generate a singular health screening using your auto information.'),
    async execute(interaction: HSBCommandInteraction) {
        await interaction.client.screeningClient.queueAutoCommand(interaction.user.id, {
            itemType: ItemType.interaction,
            item: interaction
        });
    },
};
