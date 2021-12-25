import { resolve } from "path";
import { MessageEmbed } from "discord.js";
import { readFile } from "fs/promises";
import HealthScreeningBotClient from "../client/extraClient";

export const guideRoot = resolve(__dirname, "../../guides/");

export function getGuidePath(guideName: string): string {
  return resolve(guideRoot, guideName + ".md");
}

export async function loadGuide(path: string): Promise<MessageEmbed> {
  const data = await readFile(path, "utf8");
  return new MessageEmbed().setDescription(data);
}

export async function loadAllGuides(client: HealthScreeningBotClient) {
  for (const item of client.guideData.values()) {
    if (item.files) {
      item.embeds = await Promise.all(
        item.files.map(async (file) => {
          return await loadGuide(file);
        })
      );
    }
    if (item.title) {
      item.embeds?.forEach((embed) => {
        embed.setTitle(item.title!);
      });
    }
  }
}
