import { Collection } from "discord.js";

import { Subcommand } from ".";

export interface SubcommandContainer {
  subcommands: Collection<string, Subcommand>;
}
