import { CustomError } from "./CustomError.js";

/**
 * Custom error class for representing that there are invalid arguments.
 *
 * @extends {CustomError}
 */
export class InvalidArgumentsError extends CustomError {
  /**
   * @param {string} fn_path - function name or path that the error is occurred.
   * @param {string|number} parameter_name - parameter name bound with the invalid argument
   *                                         or parameter position number.
   * @param {string=} detail_description - reason why the argument is invalid.
   */
  constructor(fn_path, parameter_name, detail_description) {
    const description = `parameter ${parameter_name} is invalid.${
      detail_description ? `: ${detail_description}` : ""
    }`;
    super(fn_path, description);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidArgumentsError);
    }
  }
}
