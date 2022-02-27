import { ValidationError } from "sequelize";

export default function sequelizeValidationError(
  error: ValidationError,
  type: string,
  metadata?: object
): object {
  return {
    original: metadata || null,
    supplemented: {
      validationErrors: error.errors,
    },
  };
}
