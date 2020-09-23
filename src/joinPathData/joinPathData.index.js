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
 * @typedef {number|Array<Parameter>} Parameter
 */

const FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS = `$$toStringPathCommandParameters`;
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
  if (
    equals2(command.toLowerCase(), "m") ||
    equals2(command.toLowerCase(), "l") ||
    equals2(command.toLowerCase(), "t")
  ) {
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

  if (
    equals2(command.toLowerCase(), "h") ||
    equals2(command.toLowerCase(), "v")
  ) {
    if (!Number.isFinite(parameters)) {
      throw new InvalidArgumentsError(
        FN_PATH_TO_STRING_PATH_COMMAND_PARAMETERS,
        `"parameters"`,
        JSON.stringify({ command, parameters })
      );
    }
    return `${command} ${parameters}`;
  }

  if (equals2(command.toLowerCase(), "c")) {
    return go(
      parameters,
      tap((l) => {
        if (!isArray(l) || not(equals2(l.length, 3))) {
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

  if (
    equals2(command.toLowerCase(), "s") ||
    equals2(command.toLowerCase(), "q")
  ) {
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

  if (equals2(command.toLowerCase(), "a")) {
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
        every((flag) => equals2(0, flag) || equals2(1, flag), [
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

  if (equals2(command.toLowerCase(), "z")) {
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
 * @param {Array<{command: Command, parameters: Parameter}>} path_data
 * @returns {string}
 * @throws {InvalidArgumentsError}
 */
export const $$joinPathData = (path_data = []) =>
  go(
    path_data,
    toIter,
    function* (iter) {
      const { value, done } = iter.next();
      if (done) {
        return;
      }

      if (not(equals2(value.command.toLowerCase(), "m"))) {
        throw new InvalidArgumentsError(
          FN_PATH_JOIN_PATH_DATA,
          `"path_data"`,
          `The first command is not one of "M" and "m".`
        );
      }

      yield value;
      yield* iter;
    },
    mapL($$toStringPathCommandParameters),
    join(" ")
  );
