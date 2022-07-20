import {
  AutocompleteInteraction,
  Collection,
  CommandInteraction,
} from "discord.js";

import { PreCommandChecks } from "./preCommandChecks";

// eslint-disable-next-line import/prefer-default-export -- Some nasty export errors occur when making this a default.
export abstract class BaseCommand implements PreCommandChecks {
  /**
   * A mapping of fields that will support autocomplete to the functions that will
   * be executed when said fields are autocompleted.
   */
  public autocompleteFields: Collection<
    string,
    (interaction: AutocompleteInteraction) => Promise<void>
  > = new Collection();

  /**
   * The function that will run whenever this command is used as a slash command.
   * @param interaction The interaction object.
   */
  execute?(interaction: CommandInteraction): Promise<void>;

  // Hack to silence typescript
  beforeExecute?(interaction: CommandInteraction): Promise<boolean>;

  beforeAutocomplete?(interaction: AutocompleteInteraction): Promise<boolean>;
}
