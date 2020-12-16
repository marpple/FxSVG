/**
 * Custom error class for FxSVG package.
 * This is the most base error representing custom errors.
 *
 * @extends {Error}
 */
export class CustomError extends Error {
  /**
   *
   * @param {string} [fn_path="<anonymous>"] - function name or path that the error is occurred.
   * @param {string} [description]
   */
  constructor(fn_path = "<anonymous>", description) {
    const message = `Failed to execute '${fn_path}' (FxSVG)${
      description ? `: ${description}` : ""
    }`;
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}
