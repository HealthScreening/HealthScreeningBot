export default function generateNumberChoicesInRange(
  start: number,
  end: number,
  step = 1
): [string, number][] {
  const choices: [string, number][] = [];
  for (let i = start; i <= end; i += step) {
    choices.push([i.toString(), i]);
  }
  return choices;
}
