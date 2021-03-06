import { Collection, EmbedBuilder } from "discord.js";
import { readFile } from "fs/promises";
import { resolve } from "path";

import HealthScreeningBotClient from "../client/extraClient";
import guideData from "../data/guideData.json";

export const guideRoot = resolve(__dirname, "../../guides/");

export type GuideItem = {
  title: string | string[];
  files: string[];
  shortTitle: string;
};

export function getGuidePath(guideName: string): string {
  return resolve(guideRoot, `${guideName}.md`);
}

export async function loadGuide(path: string): Promise<EmbedBuilder> {
  const data = await readFile(path, "utf8");
  return new EmbedBuilder().setDescription(data);
}

export async function loadAllGuides(client: HealthScreeningBotClient) {
  const collection = new Collection<string, EmbedBuilder[]>();
  await Promise.all(
    Object.entries(guideData as { [key: string]: GuideItem }).map(
      async ([key, value]) => {
        collection.set(
          key,
          await Promise.all(
            value.files.map(async (file, index) => {
              const guide = await loadGuide(getGuidePath(file));
              if (typeof value.title === "string") {
                guide.setTitle(value.title);
              } else {
                guide.setTitle(value.title[index]);
              }

              return guide;
            })
          )
        );
      }
    )
  );
  // eslint-disable-next-line no-param-reassign -- This is intentional.
  client.guideData = collection;
}
