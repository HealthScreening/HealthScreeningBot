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

/**
 * Automatically generates the guide directory
 */
import { writeFile } from "fs/promises";
import { resolve } from "path";

import guideData from "../src/data/guideData.json";
import { GuideItem } from "../src/utils/guides";

const text: string = (Object.entries(guideData) as [string, GuideItem][])
  .filter((item) => !item[0].startsWith("_"))
  .sort((a, b) => {
    if (a[1].shortTitle < b[1].shortTitle) {
      return -1;
    }
    if (a[1].shortTitle > b[1].shortTitle) {
      return 1;
    }
    return 0;
  })
  .map(([key, value]) => [key, value.shortTitle])
  .map(([key, value]) => `**${value}**: \`/guide name:${key}\``)
  .join("\n");

writeFile(resolve(__dirname, "..", "guides", "guides.md"), text).then(() =>
  console.log("Generated guides.md")
);
