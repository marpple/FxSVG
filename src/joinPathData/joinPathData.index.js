import { deepFlatL, join, mapL, isArray } from "fxjs2";
import { InvalidArgumentsError } from "../Errors/InvalidArgumentsError.js";
import {
  REGEXP_STR_DRAW_TO_COMMAND,
  REGEXP_STR_SVG_PATH,
} from "../parsePathData/const.js";

const VALID_COMMAND_SET = new Set([
  "M",
  "m",
  "L",
  "l",
  "H",
  "h",
  "V",
  "v",
  "C",
  "c",
  "S",
  "s",
  "Q",
  "q",
  "T",
  "t",
  "A",
  "a",
  "Z",
  "z",
]);

/**
 * @typedef {string} Command
 * @description command is one of "M", "m", "L", "l", "H", "h", "V", "v", "C", "c", "S", "s", "Q", "q", "T", "t", "A", "a", "Z", "z".
 */

/**
 * @typedef {number|Array<Parameter>} Parameter
 */

const FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS = `$$toStringPathCommandParameters`;
/**
 * Make SVG path data string of the input command + parameters object.
 *
 * @param {Object} path_command_parameters
 * @param {Command} path_command_parameters.command
 * @param {Parameter|Array<Parameter>} path_command_parameters.parameters
 * @returns {string} SVG path + parameters path data string
 * @throws {InvalidArgumentsError}
 */
export const $$toStringPathCommandParameters = ({ command, parameters }) => {
  if (!VALID_COMMAND_SET.has(command)) {
    throw new InvalidArgumentsError(
      FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
      "command"
    );
  }

  const str = `${command} ${
    isArray(parameters) ? join(" ", deepFlatL(parameters)) || "" : parameters
  }`.trim();
  if (!new RegExp(`^${REGEXP_STR_DRAW_TO_COMMAND}$`).test(str)) {
    throw new InvalidArgumentsError(
      FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
      `"parameters"`
    );
  }

  return str;
};

const FN_PATH_JOIN_PATH_DATA = `$$joinPathData`;
/**
 * Make SVG path data string of the input list of command + parameters object.
 * The return string is for "d" attributes of a SVG element.
 *
 * @param {Array<{command: Command, parameters: Parameter|Array<Parameter>}>} path_data
 * @returns {string}
 * @throws {InvalidArgumentsError}
 */
export const $$joinPathData = (path_data = []) => {
  const str = join(" ", mapL($$toStringPathCommandParameters, path_data));
  if (!new RegExp(REGEXP_STR_SVG_PATH).test(str)) {
    throw new InvalidArgumentsError(FN_PATH_JOIN_PATH_DATA, `"path_data"`);
  }

  return str;
};
