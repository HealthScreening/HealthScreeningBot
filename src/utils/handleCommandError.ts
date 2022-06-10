import { MessageOptions, sendMessage } from "./multiMessage";

export default async function handleCommandError(
  params: MessageOptions,
  name?: string
) {
  if (name) {
    return sendMessage({
      ...params,
      content: `Unfortunately, the \`${name}\` command has encountered an error. This error has been logged and will be fixed ASAP.`,
      ephemeral: true,
    });
  }

  return sendMessage({
    ...params,
    content: `Unfortunately, the command has encountered an error. This error has been logged and will be fixed ASAP.`,
    ephemeral: true,
  });
}
