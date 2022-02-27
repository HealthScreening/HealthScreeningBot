import { MessageOptions, sendMessage } from "../../utils/multiMessage";

export default async function errorOnInvalid(
  params: MessageOptions
): Promise<void> {
  const messageParams: MessageOptions = {
    content:
      "You do not have any auto information stored! Use `/set_auto` to set some information.",
    ephemeral: true,
    ...params,
  };
  await sendMessage(messageParams);
}
