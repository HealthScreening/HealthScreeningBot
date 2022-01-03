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
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import pathsGenerator from "walk-asyncgen";

// language=ts
const gplString = `/**
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
 */`;

async function processFile(path: string) {
  const text = await readFile(path, "utf8");
  if (!text.trim().startsWith(gplString)) {
    await writeFile(path, gplString + "\n" + text, "utf8");
  }
}

async function main() {
  const promises: Promise<void>[] = [];
  for await (const path of pathsGenerator(resolve(__dirname, ".."), {
    excludeDirs: /(node_modules|\.git)\/?.*/,
  })) {
    if (path.endsWith(".ts")) {
      promises.push(processFile(path));
    }
  }
  await Promise.all(promises);
}

main().then(() => {
  console.log("Done");
});
