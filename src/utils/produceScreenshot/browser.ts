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

import { Browser } from "puppeteer";
/* eslint-disable @typescript-eslint/no-var-requires -- Really hates it if I don't do this */
const puppeteer = require("puppeteer");
/* eslint-enable @typescript-eslint/no-var-requires */

export let browser: Browser | null = null;

export async function startupBrowser(): Promise<void> {
  if (browser === null) {
    browser = await puppeteer.launch({
      headless: true,
    });
  }
}

export async function closeBrowser(): Promise<void> {
  if (browser !== null) {
    await browser.close();
    browser = null;
  }
}
