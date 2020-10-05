import {
  join,
  mapL,
  isArray,
  equals2,
  go,
  eachL,
  not,
  tap,
  every,
  toIter,
  flatL,
} from "fxjs2";
import { InvalidArgumentsError } from "../Errors/InvalidArgumentsError.js";

/**
 * @typedef {string} Command
 * @description command is one of "M", "m", "L", "l", "H", "h", "V", "v", "C", "c", "S", "s", "Q", "q", "T", "t", "A", "a", "Z", "z".
 */

/**
 * @typedef {number|Array<number>|Array<Array<number>>} Parameter
 */

const FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS = `$$toStringPathCommandParameters`;

const COMMAND_MLT = new Set(["M", "m", "L", "l", "T", "t"]);
const COMMAND_HV = new Set(["H", "h", "V", "v"]);
const COMMAND_C = new Set(["C", "c"]);
const COMMAND_SQ = new Set(["S", "s", "Q", "q"]);
const COMMAND_A = new Set(["A", "a"]);
const COMMAND_Z = new Set(["Z", "z"]);

const ARC_ARG_FLAG_SET = new Set([0, 1]);

/**
 * Make SVG path data string of the input command + parameters object.
 *
 * @param {Object} path_command_parameters
 * @param {Command} path_command_parameters.command
 * @param {Parameter} path_command_parameters.parameters
 * @returns {string} SVG path + parameters path data string
 * @throws {InvalidArgumentsError}
 */
export const $$toStringPathCommandParameters = ({ command, parameters }) => {
  if (COMMAND_MLT.has(command)) {
    return go(
      parameters,
      tap((l) => {
        if (!isArray(l) || not(equals2(l.length, 2))) {
          throw new InvalidArgumentsError(
            FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      eachL((a) => {
        if (!Number.isFinite(a)) {
          throw new InvalidArgumentsError(
            FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      join(" "),
      (s) => `${command} ${s}`
    );
  }

  if (COMMAND_HV.has(command)) {
    if (!Number.isFinite(parameters)) {
      throw new InvalidArgumentsError(
        FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
        `"parameters"`,
        JSON.stringify({ command, parameters })
      );
    }
    return `${command} ${parameters}`;
  }

  const is_command_c = COMMAND_C.has(command);
  const is_command_sq = COMMAND_SQ.has(command);
  if (is_command_c || is_command_sq) {
    return go(
      parameters,
      tap((l) => {
        if (!isArray(l) || not(equals2(l.length, is_command_c ? 3 : 2))) {
          throw new InvalidArgumentsError(
            FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      eachL((pair) => {
        if (!isArray(pair) || not(equals2(pair.length, 2))) {
          throw new InvalidArgumentsError(
            FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      flatL,
      eachL((a) => {
        if (!Number.isFinite(a)) {
          throw new InvalidArgumentsError(
            FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      join(" "),
      (s) => `${command} ${s}`
    );
  }

  if (COMMAND_A.has(command)) {
    if (!isArray(parameters) || not(equals2(parameters.length, 7))) {
      throw new InvalidArgumentsError(
        FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
        `"parameters"`,
        JSON.stringify({ command, parameters })
      );
    }
    const [
      rx,
      ry,
      x_axis_rotation,
      large_arc_flag,
      sweep_flag,
      x,
      y,
    ] = parameters;
    if (
      not(every(Number.isFinite, [rx, ry, x_axis_rotation, x, y])) ||
      not(
        every((flag) => ARC_ARG_FLAG_SET.has(flag), [
          large_arc_flag,
          sweep_flag,
        ])
      )
    ) {
      throw new InvalidArgumentsError(
        FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
        `"parameters"`,
        JSON.stringify({ command, parameters })
      );
    }
    return `${command} ${rx} ${ry} ${x_axis_rotation} ${large_arc_flag} ${sweep_flag} ${x} ${y}`;
  }

  if (COMMAND_Z.has(command)) {
    if (!isArray(parameters) || parameters.length > 0) {
      throw new InvalidArgumentsError(
        FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
        `"parameters"`,
        JSON.stringify({ command, parameters })
      );
    }
    return command;
  }

  throw new InvalidArgumentsError(
    FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
    `"command"`,
    JSON.stringify({ command, parameters })
  );
};

const FN_PATH_JOIN_PATH_DATA = `$$joinPathData`;
/**
 * Make SVG path data string of the input list of command + parameters object.
 * The return string is for "d" attributes of a SVG element.
 *
 * @param {Array<{command: Command, parameters: Parameter}>} [path_data=[]]
 * @returns {string}
 * @throws {InvalidArgumentsError}
 */
export const $$joinPathData = (path_data = []) =>
  go(
    path_data,
    toIter,
    function* checkStartsWithM(iter) {
      const { value, done } = iter.next();
      if (done) {
        return;
      }

      if (not(equals2(value.command.toLowerCase(), "m"))) {
        throw new InvalidArgumentsError(
          FN_PATH_JOIN_PATH_DATA,
          `"path_data"`,
          `the first command is not one of "M" and "m".`
        );
      }

      yield value;
      yield* iter;
    },
    mapL($$toStringPathCommandParameters),
    join(" ")
  );
