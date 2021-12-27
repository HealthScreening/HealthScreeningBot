/**
 * Automatically generates the guide directory
 */

import guideData from "../src/data/guideData.json"
import {writeFile} from "fs/promises"
import { GuideItem } from "../src/utils/guides";
import { resolve } from "path";

const text: string = (Object.entries(guideData) as [string, GuideItem][]).filter((item) => !item[0].startsWith("_")).sort((a, b) => {
    if (a[1].shortTitle < b[1].shortTitle){
      return -1
    }
    if (a[1].shortTitle > b[1].shortTitle){
      return 1
    }
    return 0;
}).map(([key, value]) => [key, value.shortTitle]).map(([key, value]) => `**${value}**: \`/guide name:${key}\``).join("\n")

writeFile(resolve(__dirname, "..", "guides", "guides.md"), text).then(() => console.log("Generated guides.md"));