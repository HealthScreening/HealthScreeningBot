import { CommandInteraction } from 'discord.js'
import HealthScreeningBotClient from "./client/extraClient";

declare module discordjsOverrides {
    export class HSBCommandInteraction extends CommandInteraction{
        public readonly client: HealthScreeningBotClient
    }
}