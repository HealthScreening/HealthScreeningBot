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

export function objectToWrapper(input: {
  // Skipped because no better way to do this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}): Record<string, string> {
  const obj: { [k: string]: string } = {};
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      obj[key] =
        input[key] === null || input[key] === undefined
          ? ""
          : String(input[key]);
    }
  }
  return obj;
}
