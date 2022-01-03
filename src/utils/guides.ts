/**
 * Copyright (C) 2021-2022 PythonCoderAS
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
import { Collection, MessageEmbed } from "discord.js";
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
  return resolve(guideRoot, guideName + ".md");
}

export async function loadGuide(path: string): Promise<MessageEmbed> {
  const data = await readFile(path, "utf8");
  return new MessageEmbed().setDescription(data);
}

export async function loadAllGuides(client: HealthScreeningBotClient) {
  const collection = new Collection<string, MessageEmbed[]>();
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
  client.guideData = collection;
}
