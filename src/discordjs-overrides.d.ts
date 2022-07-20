/* eslint-disable max-classes-per-file -- Overrides are allowed to bypass this */
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  MessageComponentInteraction,
  SelectMenuInteraction,
} from "discord.js";

import HealthScreeningBotClient from "./client/extraClient";

export declare class HSBCommandInteraction extends ChatInputCommandInteraction {
  public readonly client: HealthScreeningBotClient;
}

export declare class HSBAutocompleteInteraction extends AutocompleteInteraction {
  public readonly client: HealthScreeningBotClient;
}

export declare class HSBMessageComponentInteraction extends MessageComponentInteraction {
  public readonly client: HealthScreeningBotClient;
}

export declare class HSBSelectMenuInteraction extends SelectMenuInteraction {
  public readonly client: HealthScreeningBotClient;
}
