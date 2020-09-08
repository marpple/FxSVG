import { isNil, not } from "fxjs2";
import { REGEXP_STR_COMMAND } from "./REGEXP_STR.js";

/**
 * Generator yields index number where the command character is.
 *
 * @param {string} d_str
 * @returns {Generator<number, undefined, *>}
 */
export function* mapToCommandIndex(d_str) {
  const regexp_command = new RegExp(REGEXP_STR_COMMAND, "g");
  let result;
  while (not(isNil((result = regexp_command.exec(d_str))))) {
    yield result.index;
  }
}
