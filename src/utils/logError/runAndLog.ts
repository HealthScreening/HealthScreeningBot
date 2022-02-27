import logError from "./index";

export default async function runFunctionAndLogError(
  func: () => Promise<void>,
  name: string
) {
  try {
    await func();
  } catch (e) {
    await logError(e, name);
  }
}
