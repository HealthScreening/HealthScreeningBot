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
import { ProcessParams } from "../interfaces";

export default async function logSuccess(params: ProcessParams, success: boolean, timeElapsed?: number) {
  if (success) {
    params.auto?.logChannel.send(
      `Finished screening **${params.auto.batchTime[0]}:${
        params.auto.batchTime[1]
      }::${params.auto.itemNumber}** in ${(timeElapsed! / 1000).toFixed(
        2
      )} seconds`
    );
  }
  else {
    params.auto?.logChannel.send(
      `Failed screening **${params.auto.batchTime[0]}:${params.auto.batchTime[1]}::${params.auto.itemNumber}**`
    );
  }
}