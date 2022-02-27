import { ValidationError } from "sequelize";

import { version } from "../../../package.json";
import { ErrorLog } from "../../orm/errorLog";
import ignoreError from "./ignoreError";
import sequelizeValidationError from "./supplementors/sequelizeValidationError";

export type SupplementorFunction<E extends Error = Error> = (
  error: E,
  type: string,
  metadata?: object
) => object;

export const supplementors: {
  [key: string]: SupplementorFunction;
} = {
  ValidationError:
    sequelizeValidationError as SupplementorFunction<ValidationError>,
  SequelizeUniqueConstraintError:
    sequelizeValidationError as SupplementorFunction<ValidationError>,
};

export default async function logError(
  error: Error,
  type: string,
  metadata?: object
): Promise<ErrorLog | null> {
  if (ignoreError(error, type)) {
    return null;
  }
  const errorName: string = error.name;
  const errorMessage: string | null =
    error.message.length > 0 ? error.message : null;
  const trueMetadata: object | null = Object.prototype.hasOwnProperty.call(
    supplementors,
    errorName
  )
    ? supplementors[errorName](error, type, metadata)
    : metadata || null;
  const errorStack: string | null = error.stack || null;
  if (version.search(/[^\d.]/) !== -1) {
    console.error(error);
  }
  return await ErrorLog.create({
    errorName,
    errorDescription: errorMessage,
    errorStack,
    metadata: trueMetadata,
    type,
  });
}
