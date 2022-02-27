import {
  AutocompleteInteraction,
  CommandInteraction,
  MessageComponentInteraction,
  SelectMenuInteraction,
} from "discord.js";

import HealthScreeningBotClient from "./client/extraClient";

export declare class HSBCommandInteraction extends CommandInteraction {
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
