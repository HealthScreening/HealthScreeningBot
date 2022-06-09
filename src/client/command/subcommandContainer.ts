import { Collection } from "discord.js";

import { Subcommand } from "../command";

export interface SubcommandContainer {
  subcommands: Collection<string, Subcommand>;
}
