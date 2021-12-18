import { isEqual } from "lodash";
import * as errorLogIgnore from "../../../errorLogIgnore.json";

export default function ignoreError(
  error: Error,
  type: string
): boolean {
  const comparsionObject = {
    type,
    name: error.name,
    message: error.message,
  }
  return errorLogIgnore.some(item => isEqual(comparsionObject, item));
}