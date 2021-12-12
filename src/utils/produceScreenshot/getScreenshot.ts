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
import { GetScreenshotParams } from "./interfaces";
import * as Buffer from "buffer";
import { browser } from "./browser";
import { devices } from "puppeteer";

export default async function getScreenshot(
  options: GetScreenshotParams
): Promise<Buffer> {
  const page = await browser!.newPage();
  try {
    await page.emulate(devices[options.device || "iPhone 11"]);
    await page.goto(
      `file://${__dirname}/../screening-success-html/page.html?` +
        new URLSearchParams(objectToWrapper(options)).toString()
    );
    await page.evaluate(() => {
      window.scrollBy(0, -10000);
    });
    return (await page.screenshot()) as Buffer;
  } finally {
    await page.close();
  }
}
