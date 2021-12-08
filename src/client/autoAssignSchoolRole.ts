import { DiscordAPIError, GuildMember } from "discord.js";
import { Config } from "../orm";

export default async function assignAutoSchoolRole(client) {
  const data = {
    "bxscience.edu": "893918744437456916",
    "bths.edu": "893918912188661850",
    "stuy.edu": "893918994216681473",
  };
  const items = await Config.findAll();
  const guild = client.guilds.cache.get("889983763994521610");
  let suffix: string, roleId: string, member: GuildMember;
  for (const item of items) {
    for (const suffix_data of Object.entries(data)) {
      suffix = suffix_data[0];
      roleId = suffix_data[1];
      // @ts-ignore
      if (item.email.endsWith(suffix)) {
        try {
          // @ts-ignore
          member = await guild.members.fetch(item.userId);
        }
        catch (e) {
          if (e instanceof DiscordAPIError) {
            continue;
          }
          console.error(e);
        }
        try {
          await member.roles.add(roleId, "Autorole on email in storage");
        }
        catch (e) {
          console.error(e);
        }
      }
    }
  }
}
