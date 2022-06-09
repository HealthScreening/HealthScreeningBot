export default function generateNumberChoicesInRange(
  start: number,
  end: number,
  step = 1
): { name: string; value: number }[] {
  const choices: { name: string; value: number }[] = [];
  for (let i = start; i <= end; i += step) {
    choices.push({ name: i.toString(), value: i });
  }
  return choices;
}
