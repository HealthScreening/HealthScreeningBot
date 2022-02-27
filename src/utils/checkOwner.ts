import { ItemType, MessageOptions, sendMessage } from "./multiMessage";

export default async function checkOwner(
  params: MessageOptions
): Promise<boolean> {
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
      content:
        "You are not the owner of the bot, so you cannot run this command!",
      ephemeral: true,
      ...params,
    });
  }
  return isOwner;
}
