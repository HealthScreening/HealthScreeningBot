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
import { DateTime } from "luxon";

export default async function timeMethod<T>(
  method: () => Promise<T>
): Promise<[T, number]> {
  const start = DateTime.local({
    locale: "en_US",
    zone: "America/New_York",
  }).toMillis();
  const result = await method();
  const end = DateTime.local({
    locale: "en_US",
    zone: "America/New_York",
  }).toMillis();
  return [result, end - start];
}
