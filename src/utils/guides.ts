import { resolve } from "path";
import { Collection, MessageEmbed } from "discord.js";
import { readFile } from "fs/promises";
import HealthScreeningBotClient from "../client/extraClient";
import guideData from "../data/guideData.json";

export const guideRoot = resolve(__dirname, "../../guides/");

export type GuideItem = {
  title: string | string[];
  files: string[];
}

export function getGuidePath(guideName: string): string {
  return resolve(guideRoot, guideName + ".md");
}

export async function loadGuide(path: string): Promise<MessageEmbed> {
  const data = await readFile(path, "utf8");
  return new MessageEmbed().setDescription(data);
}

export async function loadAllGuides(client: HealthScreeningBotClient) {
  const collection = new Collection<string, MessageEmbed[]>();
  await Promise.all(Object.entries(guideData as { [key: string]: GuideItem }).map(async ([key, value]) => {
    collection.set(key, []);
    await Promise.all(value.files.map(async (file) => {
      collection.get(key)!.push(await loadGuide(getGuidePath(file)));
    }))
  }))
  client.guideData = collection;
}
