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
import { ErrorLog } from "../../orm/errorLog";
import { errorType } from "./errorType";

export default async function logError(error: Error, type: errorType, metadata?: object): Promise<ErrorLog>{
  console.error(error); // Temporary until a log viewer is added
  const trueMetadata: object | null = metadata || null;
  const errorName: string = error.name;
  const errorMessage: string | null = error.message.length > 0 ? error.message : null;
  const errorStack: string | null = error.stack || null;
  return await ErrorLog.create({
    errorName,
    errorDescription: errorMessage,
    errorStack,
    metadata: trueMetadata,
    type,
  });
}