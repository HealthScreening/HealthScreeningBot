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
import { MessageOptions, sendMessage } from "./multiMessage";

export default async function handleCommandError(
  params: MessageOptions,
  name?: string
) {
  if (name) {
    return await sendMessage({
      ...params,
      content: `Unfortunately, the \`${name}\` command has encountered an error. This error has been logged and will be fixed ASAP.`,
      ephemeral: true
    });
  } else {
    return await sendMessage({
      ...params,
      content: `Unfortunately, the command has encountered an error. This error has been logged and will be fixed ASAP.`,
      ephemeral: true
    });
  }
}
