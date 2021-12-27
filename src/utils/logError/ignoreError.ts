import { isEqual } from "lodash";
import { ignores } from "../../data/errorLogIgnore.json";

export default function ignoreError(error: Error, type: string): boolean {
  const comparsionObject = {
    type,
    name: error.name,
    message: error.message,
  };
  return ignores.some((item) => isEqual(comparsionObject, item));
}
