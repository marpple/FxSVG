import {
  chunkL,
  dropL,
  each,
  eachL,
  equals2,
  flatMapL,
  go,
  head,
  isNil,
  last,
  map,
  mapL,
  not,
  reduce,
  takeAll,
  tap,
  toIter,
} from "fxjs/es";
import { InvalidArgumentsError } from "../Errors/InvalidArgumentsError.js";
import {
  FN_PATH,
  FN_PATH_PARSE_COORDINATE_SEQ,
  FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
  REGEXP_STR_COMMA_WSP,
  REGEXP_STR_COMMAND,
  REGEXP_STR_FLAG,
  REGEXP_STR_NUMBER,
} from "./const.js";

/**
 * @typedef {string} Command
 * @description one of "M", "m", "L", "l", "H", "h", "V", "v", "C", "c", "S", "s", "Q", "q", "T", "t", "A", "a", "Z", "z".
 */

/**
 * Split path data string by each command.
 * Generator yields command and parameters of the command.
 * Both command and parameters are string.
 *
 * This function will not validate input data!
 *
 * @param {string} path_data
 * @returns {Generator<{command: Command, parameters: string}, undefined, *>}
 */
export function* $$splitPathDataByCommandL(path_data) {
  const regexp = new RegExp(REGEXP_STR_COMMAND, "g");

  let prev_result;
  let result;

  prev_result = regexp.exec(path_data);
  if (!prev_result) {
    return undefined;
  }

  while (not(isNil((result = regexp.exec(path_data))))) {
    const command = path_data[prev_result.index];
    const parameters = path_data
      .slice(prev_result.index + 1, result.index)
      .trim();
    yield { command, parameters };

    prev_result = result;
  }

  const command = path_data[prev_result.index];
  const parameters = path_data.slice(prev_result.index + 1).trim();
  yield { command, parameters };
}

/**
 * @typedef {number} Coordinate
 */
/**
 * @typedef {Array<Coordinate>} CoordinatePair
 * @description Array of two "Coordinate"s.
 */
/**
 * @typedef {Array<CoordinatePair>} CoordinatePairDouble
 * @description Array of two "CoordinatePair"s.
 */
/**
 * @typedef {Array<CoordinatePair>} CoordinatePairTriplet
 * @description Array of three "CoordinatePair"s.
 */
/**
 * @typedef {Array<number>} EllipticalArcArg
 * @description [rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y]
 *              rx, ry, x_axis_rotation, x, y : number
 *              large_arc_flag, sweep_flag : 0 or 1
 */
/**
 * @typedef {(Coordinate|CoordinatePair|CoordinatePairTriplet|CoordinatePairDouble|EllipticalArcArg)} Parameter
 */

/**
 * @param {string} str
 * @returns {Iterator<number, undefined, *>}
 * @throws {InvalidArgumentsError}
 */
const $$parseCoordinateSeqL = (str) =>
  go(
    str.trim(),
    function* (str) {
      if (!str) {
        return;
      }

      const regexp_number = new RegExp(REGEXP_STR_NUMBER, "g");
      const regexp_comma_wsp = new RegExp(REGEXP_STR_COMMA_WSP, "g");

      let index = 0;

      let result;

      result = regexp_number.exec(str);
      if (!result || not(equals2(index, result.index))) {
        throw new InvalidArgumentsError(
          FN_PATH_PARSE_COORDINATE_SEQ,
          `"str"`,
          `input str : "${str}"`
        );
      }
      yield result[0];
      index = result.index + result[0].length;

      while (true) {
        regexp_comma_wsp.lastIndex = index;
        const comma_wsp_result = regexp_comma_wsp.exec(str);
        if (comma_wsp_result && equals2(index, comma_wsp_result.index)) {
          index = comma_wsp_result.index + comma_wsp_result[0].length;
        }

        regexp_number.lastIndex = index;
        const current_number_result = regexp_number.exec(str);
        if (!current_number_result) {
          break;
        }
        result = current_number_result;
        if (not(equals2(index, result.index))) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_COORDINATE_SEQ,
            `"str"`,
            `input str : "${str}"`
          );
        }
        yield result[0];
        index = result.index + result[0].length;
      }

      if (not(equals2(result.index + result[0].length, str.length))) {
        throw new InvalidArgumentsError(
          FN_PATH_PARSE_COORDINATE_SEQ,
          `"str"`,
          `input str : "${str}"`
        );
      }
    },
    mapL(Number)
  );

/**
 * Parse parameters string to array of numbers.
 * Generator yields command and parsed parameters of the command.
 *
 * @param {Object} path_command_parameters
 * @param {Command} path_command_parameters.command
 * @param {string} path_command_parameters.parameters
 * @returns {{command: Command, parameters: Array<Parameter>}}
 * @throws {InvalidArgumentsError}
 */
export const $$parsePathCommandParameters = ({ command, parameters }) => {
  if (
    equals2(command.toLowerCase(), "m") ||
    equals2(command.toLowerCase(), "l") ||
    equals2(command.toLowerCase(), "t")
  ) {
    /** @type {Array<CoordinatePair>} */
    const parsed_parameters = go(
      parameters,
      $$parseCoordinateSeqL,
      chunkL(2),
      each((pair) => {
        if (pair.length < 2) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      tap((l) => {
        if (!l.length) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      })
    );
    return { command, parameters: parsed_parameters };
  }

  if (
    equals2(command.toLowerCase(), "h") ||
    equals2(command.toLowerCase(), "v")
  ) {
    /** @type {Array<Coordinate>} */
    const parsed_parameters = go(
      parameters,
      $$parseCoordinateSeqL,
      takeAll,
      tap((l) => {
        if (!l.length) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      })
    );
    return { command, parameters: parsed_parameters };
  }

  if (equals2(command.toLowerCase(), "c")) {
    /** @type {Array<CoordinatePairTriplet>} */
    const parsed_parameters = go(
      parameters,
      $$parseCoordinateSeqL,
      chunkL(2),
      eachL((pair) => {
        if (pair.length < 2) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      chunkL(3),
      each((triplet) => {
        if (triplet.length < 3) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      tap((l) => {
        if (!l.length) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      })
    );
    return { command, parameters: parsed_parameters };
  }

  if (
    equals2(command.toLowerCase(), "s") ||
    equals2(command.toLowerCase(), "q")
  ) {
    /** @type {Array<CoordinatePairDouble>} */
    const parsed_parameters = go(
      parameters,
      $$parseCoordinateSeqL,
      chunkL(2),
      eachL((pair) => {
        if (pair.length < 2) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      chunkL(2),
      each((pair) => {
        if (pair.length < 2) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      tap((l) => {
        if (!l.length) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      })
    );
    return { command, parameters: parsed_parameters };
  }

  if (equals2(command.toLowerCase(), "a")) {
    /** @type {Array<EllipticalArcArg>} */
    const parsed_parameters = go(
      parameters.trim(),
      function* (str) {
        const regexp_number = new RegExp(REGEXP_STR_NUMBER, "g");
        const regexp_flag = new RegExp(REGEXP_STR_FLAG, "g");
        const regexp_comma_wsp = new RegExp(REGEXP_STR_COMMA_WSP, "g");

        if (!str) {
          return;
        }

        let result;
        let index = 0;

        const processOptional = (regexp) => {
          regexp.lastIndex = index;
          const result = regexp.exec(str);
          if (!result || not(equals2(result.index, index))) {
            return result;
          }

          index = result.index + result[0].length;
          return result;
        };
        const processRequired = (regexp) => {
          regexp.lastIndex = index;
          const result = regexp.exec(str);
          if (!result || not(equals2(result.index, index))) {
            throw new InvalidArgumentsError(
              FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
              `"parameters"`,
              JSON.stringify({ command, parameters })
            );
          }
          index = result.index + result[0].length;
          return result;
        };

        yield processRequired(regexp_number)[0];
        processOptional(regexp_comma_wsp);
        yield processRequired(regexp_number)[0];
        processOptional(regexp_comma_wsp);
        yield processRequired(regexp_number)[0];
        processRequired(regexp_comma_wsp);
        yield processRequired(regexp_flag)[0];
        processOptional(regexp_comma_wsp);
        yield processRequired(regexp_flag)[0];
        processOptional(regexp_comma_wsp);
        yield processRequired(regexp_number)[0];
        processOptional(regexp_comma_wsp);
        result = processRequired(regexp_number);
        yield result[0];

        while (true) {
          processOptional(regexp_comma_wsp);

          const temp_result = processOptional(regexp_number);
          if (!temp_result) {
            break;
          }
          yield temp_result[0];
          processOptional(regexp_comma_wsp);
          yield processRequired(regexp_number)[0];
          processOptional(regexp_comma_wsp);
          yield processRequired(regexp_number)[0];
          processRequired(regexp_comma_wsp);
          yield processRequired(regexp_flag)[0];
          processOptional(regexp_comma_wsp);
          yield processRequired(regexp_flag)[0];
          processOptional(regexp_comma_wsp);
          yield processRequired(regexp_number)[0];
          processOptional(regexp_comma_wsp);
          result = processRequired(regexp_number);
          yield result[0];
        }

        if (not(equals2(result.index + result[0].length, str.length))) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      },
      mapL(Number),
      chunkL(7),
      each((l) => {
        if (l.length < 7) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      }),
      tap((l) => {
        if (!l.length) {
          throw new InvalidArgumentsError(
            FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
            `"parameters"`,
            JSON.stringify({ command, parameters })
          );
        }
      })
    );
    return { command, parameters: parsed_parameters };
  }

  if (equals2(command.toLowerCase(), "z")) {
    return { command, parameters: [] };
  }

  throw new InvalidArgumentsError(
    FN_PATH_PARSE_PATH_COMMAND_PARAMETERS,
    `"command"`,
    JSON.stringify({ command, parameters })
  );
};

/**
 * Convert path command-parameters iterable from relative one to absolute one.
 *
 * This function will not validate input data!
 *
 * @param {Iterator<{command: Command, parameters: Array<Parameter>}, undefined, *>} path_command_parameters_iter
 * @returns {Generator<{command: Command, parameters: Array<Parameter>}, undefined, *>}
 */
export function* $$convertPathCommandParametersRelativeToAbsoluteL(
  path_command_parameters_iter
) {
  const {
    value: first_path_command_parameters,
    done,
  } = path_command_parameters_iter.next();

  if (done) {
    return undefined;
  }

  let ipx;
  let ipy;
  let cpx;
  let cpy;

  if (equals2(first_path_command_parameters.command, "M")) {
    [ipx, ipy] = head(first_path_command_parameters.parameters);
    [cpx, cpy] = last(first_path_command_parameters.parameters);
    yield first_path_command_parameters;
  } else {
    // first_path_command_parameters.command === "m"
    const parameters_iter = toIter(first_path_command_parameters.parameters);
    [ipx, ipy] = parameters_iter.next().value;
    const { parameters, cpx: updated_cpx, cpy: updated_cpy } = reduce(
      (acc, [dx, dy]) => {
        acc.cpx += dx;
        acc.cpy += dy;
        acc.parameters.push([acc.cpx, acc.cpy]);
        return acc;
      },
      { parameters: [[ipx, ipy]], cpx: ipx, cpy: ipy },
      parameters_iter
    );
    cpx = updated_cpx;
    cpy = updated_cpy;
    yield { command: "M", parameters };
  }

  for (const { command, parameters } of path_command_parameters_iter) {
    if (equals2(command, "M")) {
      [ipx, ipy] = head(parameters);
      [cpx, cpy] = last(parameters);
      yield { command, parameters };
      continue;
    }

    if (equals2(command, "m")) {
      const {
        parameters: updated_parameters,
        cpx: updated_cpx,
        cpy: updated_cpy,
      } = reduce(
        (acc, [dx, dy]) => {
          acc.cpx += dx;
          acc.cpy += dy;
          acc.parameters.push([acc.cpx, acc.cpy]);
          return acc;
        },
        { parameters: [], cpx, cpy },
        parameters
      );
      [ipx, ipy] = head(updated_parameters);
      cpx = updated_cpx;
      cpy = updated_cpy;
      yield {
        command: command.toUpperCase(),
        parameters: updated_parameters,
      };
      continue;
    }

    if (equals2(command, "L") || equals2(command, "T")) {
      [cpx, cpy] = last(parameters);
      yield { command, parameters };
      continue;
    }

    if (equals2(command, "l") || equals2(command, "t")) {
      const {
        parameters: updated_parameters,
        cpx: updated_cpx,
        cpy: updated_cpy,
      } = reduce(
        (acc, [dx, dy]) => {
          acc.cpx += dx;
          acc.cpy += dy;
          acc.parameters.push([acc.cpx, acc.cpy]);
          return acc;
        },
        { parameters: [], cpx, cpy },
        parameters
      );
      cpx = updated_cpx;
      cpy = updated_cpy;
      yield { command: command.toUpperCase(), parameters: updated_parameters };
      continue;
    }

    if (equals2(command, "H")) {
      cpx = last(parameters);
      yield { command, parameters };
      continue;
    }

    if (equals2(command, "h")) {
      const { parameters: updated_parameters, cpx: updated_cpx } = reduce(
        (acc, dx) => {
          acc.cpx += dx;
          acc.parameters.push(acc.cpx);
          return acc;
        },
        { parameters: [], cpx },
        parameters
      );
      cpx = updated_cpx;
      yield { command: command.toUpperCase(), parameters: updated_parameters };
      continue;
    }

    if (equals2(command, "V")) {
      cpy = last(parameters);
      yield { command, parameters };
      continue;
    }

    if (equals2(command, "v")) {
      const { parameters: updated_parameters, cpy: updated_cpy } = reduce(
        (acc, dy) => {
          acc.cpy += dy;
          acc.parameters.push(acc.cpy);
          return acc;
        },
        { parameters: [], cpy },
        parameters
      );
      cpy = updated_cpy;
      yield { command: command.toUpperCase(), parameters: updated_parameters };
      continue;
    }

    if (equals2(command, "C")) {
      [, , [cpx, cpy]] = last(parameters);
      yield { command, parameters };
      continue;
    }

    if (equals2(command, "c")) {
      const {
        parameters: updated_parameters,
        cpx: updated_cpx,
        cpy: updated_cpy,
      } = reduce(
        (acc, parameter) => {
          const updated_parameter = map(
            ([x, y]) => [x + acc.cpx, y + acc.cpy],
            parameter
          );
          acc.parameters.push(updated_parameter);
          [acc.cpx, acc.cpy] = updated_parameter[2];
          return acc;
        },
        { parameters: [], cpx, cpy },
        parameters
      );
      cpx = updated_cpx;
      cpy = updated_cpy;
      yield { command: command.toUpperCase(), parameters: updated_parameters };
      continue;
    }

    if (equals2(command, "S") || equals2(command, "Q")) {
      [, [cpx, cpy]] = last(parameters);
      yield { command, parameters };
      continue;
    }

    if (equals2(command, "s") || equals2(command, "q")) {
      const {
        parameters: updated_parameters,
        cpx: updated_cpx,
        cpy: updated_cpy,
      } = reduce(
        (acc, parameter) => {
          const updated_parameter = map(
            ([x, y]) => [x + acc.cpx, y + acc.cpy],
            parameter
          );
          acc.parameters.push(updated_parameter);
          [acc.cpx, acc.cpy] = updated_parameter[1];
          return acc;
        },
        { parameters: [], cpx, cpy },
        parameters
      );
      cpx = updated_cpx;
      cpy = updated_cpy;
      yield { command: command.toUpperCase(), parameters: updated_parameters };
      continue;
    }

    if (equals2(command, "A")) {
      [, , , , , cpx, cpy] = last(parameters);
      yield { command, parameters };
      continue;
    }

    if (equals2(command, "a")) {
      const {
        parameters: updated_parameters,
        cpx: updated_cpx,
        cpy: updated_cpy,
      } = reduce(
        (
          acc,
          [rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, dx, dy]
        ) => {
          acc.cpx += dx;
          acc.cpy += dy;
          acc.parameters.push([
            rx,
            ry,
            x_axis_rotation,
            large_arc_flag,
            sweep_flag,
            acc.cpx,
            acc.cpy,
          ]);
          return acc;
        },
        { parameters: [], cpx, cpy },
        parameters
      );
      cpx = updated_cpx;
      cpy = updated_cpy;
      yield { command: command.toUpperCase(), parameters: updated_parameters };
      continue;
    }

    // command === "z" or "Z"
    [cpx, cpy] = [ipx, ipy];
    yield { command: command.toUpperCase(), parameters: [] };
  }
}

/**
 * Convert some commands that are dependent to other commands.
 * "H", "V" -> "L"
 * "S" -> "C"
 * "T" -> "Q"
 *
 * This function will not validate input data!
 *
 * @param {Iterator<{command: Command, parameters: Array<Parameter>}, undefined, *>} path_command_parameters_iter
 * @returns {Generator<{command: Command, parameters: Array<Parameter>}, undefined, *>}
 */
export function* $$compressPathCommandL(path_command_parameters_iter) {
  let {
    value: path_command_parameters1,
    done,
  } = path_command_parameters_iter.next();
  let path_command_parameters2;

  if (done) {
    return undefined;
  }

  // expect first "path_command_parameters" to "M"
  let [ipx, ipy] = head(path_command_parameters1.parameters);
  let [cpx, cpy] = last(path_command_parameters1.parameters);
  yield path_command_parameters1;

  while (true) {
    ({
      value: path_command_parameters2,
      done,
    } = path_command_parameters_iter.next());
    if (done) {
      return undefined;
    }

    if (equals2(path_command_parameters2.command, "M")) {
      [ipx, ipy] = head(path_command_parameters2.parameters);
      [cpx, cpy] = last(path_command_parameters2.parameters);
      path_command_parameters1 = path_command_parameters2;
      yield path_command_parameters1;
      continue;
    }

    if (equals2(path_command_parameters2.command, "L")) {
      [cpx, cpy] = last(path_command_parameters2.parameters);
      path_command_parameters1 = path_command_parameters2;
      yield path_command_parameters1;
      continue;
    }

    if (equals2(path_command_parameters2.command, "H")) {
      const { parameters: updated_parameters, cpx: updated_cpx } = reduce(
        (acc, x) => {
          acc.parameters.push([x, cpy]);
          acc.cpx = x;
          return acc;
        },
        { parameters: [], cpx },
        path_command_parameters2.parameters
      );
      cpx = updated_cpx;
      path_command_parameters1 = {
        command: "L",
        parameters: updated_parameters,
      };
      yield path_command_parameters1;
      continue;
    }

    if (equals2(path_command_parameters2.command, "V")) {
      const { parameters: updated_parameters, cpy: updated_cpy } = reduce(
        (acc, y) => {
          acc.parameters.push([cpx, y]);
          acc.cpy = y;
          return acc;
        },
        { parameters: [], cpy },
        path_command_parameters2.parameters
      );
      cpy = updated_cpy;
      path_command_parameters1 = {
        command: "L",
        parameters: updated_parameters,
      };
      yield path_command_parameters1;
      continue;
    }

    if (equals2(path_command_parameters2.command, "C")) {
      [, , [cpx, cpy]] = last(path_command_parameters2.parameters);
      path_command_parameters1 = path_command_parameters2;
      yield path_command_parameters1;
      continue;
    }

    if (equals2(path_command_parameters2.command, "S")) {
      const {
        parameters: updated_parameters,
        cpx: updated_cpx,
        cpy: updated_cpy,
      } = go(path_command_parameters2.parameters, toIter, (iter) => {
        const [[x2, y2], [x, y]] = iter.next().value;
        let x1;
        let y1;
        if (equals2(path_command_parameters1.command, "C")) {
          const [, [old_x2, old_y2]] = last(
            path_command_parameters1.parameters
          );
          x1 = 2 * cpx - old_x2;
          y1 = 2 * cpy - old_y2;
        } else {
          x1 = cpx;
          y1 = cpy;
        }

        return reduce(
          (acc, [[x2, y2], [x, y]]) => {
            const x1 = 2 * acc.cpx - acc.old_x2;
            const y1 = 2 * acc.cpy - acc.old_y2;
            acc.parameters.push([
              [x1, y1],
              [x2, y2],
              [x, y],
            ]);
            acc.cpx = x;
            acc.cpy = y;
            acc.old_x2 = x2;
            acc.old_y2 = y2;
            return acc;
          },
          {
            parameters: [
              [
                [x1, y1],
                [x2, y2],
                [x, y],
              ],
            ],
            cpx: x,
            cpy: y,
            old_x2: x2,
            old_y2: y2,
          },
          iter
        );
      });
      cpx = updated_cpx;
      cpy = updated_cpy;
      path_command_parameters1 = {
        command: "C",
        parameters: updated_parameters,
      };
      yield path_command_parameters1;
      continue;
    }

    if (equals2(path_command_parameters2.command, "Q")) {
      [, [cpx, cpy]] = last(path_command_parameters2.parameters);
      path_command_parameters1 = path_command_parameters2;
      yield path_command_parameters1;
      continue;
    }

    if (equals2(path_command_parameters2.command, "T")) {
      const {
        parameters: updated_parameters,
        cpx: updated_cpx,
        cpy: updated_cpy,
      } = go(path_command_parameters2.parameters, toIter, (iter) => {
        const [x, y] = iter.next().value;
        let x1;
        let y1;
        if (equals2(path_command_parameters1.command, "Q")) {
          const [[old_x1, old_y1]] = last(path_command_parameters1.parameters);
          x1 = 2 * cpx - old_x1;
          y1 = 2 * cpy - old_y1;
        } else {
          x1 = cpx;
          y1 = cpy;
        }

        return reduce(
          (acc, [x, y]) => {
            const x1 = 2 * acc.cpx - acc.old_x1;
            const y1 = 2 * acc.cpy - acc.old_y1;
            acc.parameters.push([
              [x1, y1],
              [x, y],
            ]);
            acc.cpx = x;
            acc.cpy = y;
            acc.old_x1 = x1;
            acc.old_y1 = y1;
            return acc;
          },
          {
            parameters: [
              [
                [x1, y1],
                [x, y],
              ],
            ],
            cpx: x,
            cpy: y,
            old_x1: x1,
            old_y1: y1,
          },
          iter
        );
      });
      cpx = updated_cpx;
      cpy = updated_cpy;
      path_command_parameters1 = {
        command: "Q",
        parameters: updated_parameters,
      };
      yield path_command_parameters1;
      continue;
    }

    if (equals2(path_command_parameters2.command, "A")) {
      [, , , , , cpx, cpy] = last(path_command_parameters2.parameters);
      path_command_parameters1 = path_command_parameters2;
      yield path_command_parameters1;
      continue;
    }

    // command "Z"
    // ignore duplicate "Z"
    if (not(equals2(path_command_parameters1.command, "Z"))) {
      [cpx, cpy] = [ipx, ipy];
      path_command_parameters1 = path_command_parameters2;
      yield path_command_parameters1;
    }
  }
}

/**
 * Spreed path_command_parameters for each parameter.
 * Flatten "command and parameter sequence" to "sequence of command and parameter".
 *
 * This function will not validate input data!
 *
 * @param {Object} path_command_parameters
 * @param {Command} path_command_parameters.command
 * @param {Array<Parameter>} path_command_parameters.parameters
 * @returns {Generator<{command: Command, parameters: Parameter}, undefined, *>}
 */
export function* $$flatPathCommandParametersL({ command, parameters }) {
  if (equals2(command.toUpperCase(), "M")) {
    yield { command, parameters: head(parameters) };
    const line_to_command = equals2(command, "m") ? "l" : "L";
    yield* /** @type {Iterator<{command: string, parameters: CoordinatePair}, undefined, *>} */ go(
      parameters,
      dropL(1),
      mapL((coordinate_pair) => ({
        command: line_to_command,
        parameters: coordinate_pair,
      }))
    );
    return undefined;
  }

  if (equals2(command.toUpperCase(), "Z")) {
    yield { command, parameters };
    return undefined;
  }

  // "L", "l", "H", "h", "V", "v", "C", "c", "S", "s", "Q", "q", "T", "t", "A", "a"
  yield* /** @type {Iterator<{command: string, parameters: Parameter}, undefined, *>} */ mapL(
    (parameters) => ({ command, parameters }),
    parameters
  );
}

/**
 * Parse path data string to an iterator of {command, parameters} object.
 * Apply converting, compressing, flattening process above.
 *
 * @param {string=} d_str - path data
 * @returns {Iterator<{command: string, parameters: Parameter}, undefined, *>}
 * @throws {InvalidArgumentsError}
 */
export const $$parsePathDateL = (d_str) => {
  if (isNil(d_str)) {
    return /** @type {Iterator<{command: string, parameters: Parameter}, undefined, *>} */ toIter(
      []
    );
  }

  return go(
    $$splitPathDataByCommandL(d_str),
    function* (iter) {
      const { value, done } = iter.next();
      if (done) {
        return;
      }

      if (
        not(equals2(value.command, "M")) &&
        not(equals2(value.command, "m"))
      ) {
        throw new InvalidArgumentsError(
          FN_PATH,
          `"d_str"`,
          `The first command is not one of "M" and "m".`
        );
      }

      yield value;
      yield* iter;
    },
    mapL($$parsePathCommandParameters),
    $$convertPathCommandParametersRelativeToAbsoluteL,
    $$compressPathCommandL,
    flatMapL($$flatPathCommandParametersL)
  );
};
