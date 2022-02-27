import { DateTime } from "luxon";

export default async function timeMethod<T>(
  method: () => Promise<T>
): Promise<[T, number]> {
  const start = DateTime.local({
    locale: "en_US",
    zone: "America/New_York",
  }).toMillis();
  const result = await method();
  const end = DateTime.local({
    locale: "en_US",
    zone: "America/New_York",
  }).toMillis();
  return [result, end - start];
}
