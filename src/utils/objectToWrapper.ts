export function objectToWrapper(input: {
  // Skipped because no better way to do this
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
}): Record<string, string> {
  const obj: { [k: string]: string } = {};
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      obj[key] =
        input[key] === null || input[key] === undefined
          ? ""
          : String(input[key]);
    }
  }
  return obj;
}
