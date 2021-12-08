import { CommandInteraction } from "discord.js";
import HealthScreeningBotClient from "./client/extraClient";

export declare class HSBCommandInteraction extends CommandInteraction {
  public readonly client: HealthScreeningBotClient;
}
