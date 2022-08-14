import { discord } from "../../config";
import { ItemType, MessageOptions, sendMessage } from "./multiMessage";

export default async function checkOwner(
  params: MessageOptions
): Promise<boolean> {
  let isOwner = false;
  // eslint-disable-next-line default-case -- Enum values are guaranteed to be exhaustive
  switch (params.itemType) {
    case ItemType.interaction:
      isOwner = params.item.user.id === discord.ownerId;
      break;
    case ItemType.message:
      isOwner = params.item.author.id === discord.ownerId;
      break;
    case ItemType.user:
      isOwner = params.item.id === discord.ownerId;
      break;
  }

  if (!isOwner) {
    await sendMessage({
      content:
        "You are not the owner of the bot, so you cannot run this command!",
      ephemeral: true,
      ...params,
    });
  }

  return isOwner;
}
