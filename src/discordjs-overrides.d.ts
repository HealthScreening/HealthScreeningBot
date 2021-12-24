/**
 * Copyright (C) 2021 PythonCoderAS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { AutocompleteInteraction, CommandInteraction, MessageComponentInteraction } from "discord.js";
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