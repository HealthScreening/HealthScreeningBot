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
import { ItemType, MessageOptions, sendMessage } from "./multiMessage";


export default async function checkOwner(params: MessageOptions): Promise<boolean> {
    let isOwner = false;
    switch (params.itemType) {
    case ItemType.interaction:
        isOwner = params.item.user.id === "199605025914224641";
        break;
    case ItemType.message:
      isOwner = params.item.author.id === "199605025914224641";
      break;
    case ItemType.user:
      isOwner = params.item.id === "199605025914224641";
      break;
    }
    if (!isOwner) {
      await sendMessage({
        content: "You are not the owner of the bot, so you cannot run this command!",
        ...params
      })
    }
    return isOwner;
}