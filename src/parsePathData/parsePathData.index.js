import {
  equals2,
  go,
  head,
  isNil,
  isString,
  last,
  map,
  mapL,
  not,
  reduce,
  take,
  toIter,
} from "fxjs2";
import { InvalidArgumentsError } from "../Errors/InvalidArgumentsError.js";
import {
  FN_PATH,
  REGEXP_STR_COMMAND,
  REGEXP_STR_COORDINATE,
  REGEXP_STR_COORDINATE_PAIR,
  REGEXP_STR_COORDINATE_PAIR_DOUBLE,
  REGEXP_STR_COORDINATE_PAIR_TRIPLET,
  REGEXP_STR_ELLIPTICAL_ARC_ARG,
  REGEXP_STR_FLAG,
  REGEXP_STR_NUMBER,
  REGEXP_STR_SVG_PATH,
} from "./const.js";

/**
 * Check the input path data string is valid or not.
 *
 * @param {*} path_data - string value of "d" attribute.
 * @returns {boolean}
 */
export const $$isValidPathData = (path_data) =>
  isString(path_data) && new RegExp(REGEXP_STR_SVG_PATH).test(path_data);

/**
 * Split path data string by each command.
 * Generator yields command and parameters of the command.
 * Both command and parameters are string.
 *
 * This function will not validate path data!
 * Please check path data using "$$isValidPathData" first!
 *
 * @param {string} path_data
 * @returns {Generator<{command: string, parameters: string}, undefined, *>}
 */
export function* $$splitPathDataByCommandL(path_data) {
  const command_index_iter = (function* (d_str) {
    const regexp_command = new RegExp(REGEXP_STR_COMMAND, "g");
    let result;
    while (not(isNil((result = regexp_command.exec(d_str))))) {
      yield result.index;
    }
  })(path_data);

  let index1;
  let done1;
  let { value: index2, done: done2 } = command_index_iter.next();
  while (true) {
    index1 = index2;
    done1 = done2;
    ({ value: index2, done: done2 } = command_index_iter.next());

    if (done1) {
      return undefined;
    }

    if (done2) {
      const command = path_data[index1];
      const parameters = path_data.slice(index1 + 1).trim();
      yield { command, parameters };
      return undefined;
    }

    const command = path_data[index1];
    const parameters = path_data.slice(index1 + 1, index2).trim();
    yield { command, parameters };
  }
}

/**
 * @typedef {number} Coordinate
 */
/**
 * @typedef {Array<number>} CoordinatePair
 * @description Array of two numbers.
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
 * This function will not validate input data!
 * Please check yourself first!
 *
 * @param {string} coordinate_pair
 * @returns {CoordinatePair}
 */
const parseCoordinatePair = (coordinate_pair) =>
  go(
    coordinate_pair.matchAll(new RegExp(REGEXP_STR_COORDINATE, "g")),
    mapL(head),
    mapL(Number),
    take(2)
  );
/**
 * Parse parameters string to array of numbers.
 * Generator yields command and parsed parameters of the command.
 *
 * This function will not validate input data!
 * Please check yourself first!
 *
 * @param {string} command
 * @param {string} parameters
 * @returns {{command: string, parameters: Array<Parameter>}}
 */
export const $$parsePathCommandParameters = ({ command, parameters }) => {
  if (
    equals2(command.toLowerCase(), "m") ||
    equals2(command.toLowerCase(), "l") ||
    equals2(command.toLowerCase(), "t")
  ) {
    /** @type {Array<CoordinatePair>} */
    const parsed_parameters = go(
      parameters.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR, "g")),
      mapL(head),
      map(parseCoordinatePair)
    );
    return { command, parameters: parsed_parameters };
  }

  if (
    equals2(command.toLowerCase(), "h") ||
    equals2(command.toLowerCase(), "v")
  ) {
    /** @type {Array<Coordinate>} */
    const parsed_parameters = go(
      parameters.matchAll(new RegExp(REGEXP_STR_COORDINATE, "g")),
      mapL(head),
      map(Number)
    );
    return { command, parameters: parsed_parameters };
  }

  if (equals2(command.toLowerCase(), "c")) {
    /** @type {Array<CoordinatePairTriplet>} */
    const parsed_parameters = go(
      parameters.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR_TRIPLET, "g")),
      mapL(head),
      map((triplet) =>
        go(
          triplet.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR, "g")),
          mapL(head),
          mapL(parseCoordinatePair),
          take(3)
        )
      )
    );
    return { command, parameters: parsed_parameters };
  }

  if (
    equals2(command.toLowerCase(), "s") ||
    equals2(command.toLowerCase(), "q")
  ) {
    /** @type {Array<CoordinatePairDouble>} */
    const parsed_parameters = go(
      parameters.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR_DOUBLE, "g")),
      mapL(head),
      map((double) =>
        go(
          double.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR, "g")),
          mapL(head),
          mapL(parseCoordinatePair),
          take(2)
        )
      )
    );
    return { command, parameters: parsed_parameters };
  }

  if (equals2(command.toLowerCase(), "a")) {
    /** @type {Array<EllipticalArcArg>} */
    const parsed_parameters = go(
      parameters.matchAll(new RegExp(REGEXP_STR_ELLIPTICAL_ARC_ARG, "g")),
      mapL(head),
      map((arc_arg) => {
        const [
          [rx_str],
          [ry_str],
          { 0: x_axis_rotation_str, index: _index1 },
        ] = arc_arg.matchAll(new RegExp(REGEXP_STR_NUMBER, "g"));
        const index1 = _index1 + x_axis_rotation_str.length;
        const [rx, ry, x_axis_rotation] = mapL(Number, [
          rx_str,
          ry_str,
          x_axis_rotation_str,
        ]);

        const [
          [large_arc_flag_str],
          { 0: sweep_flag_str, index: _index2 },
        ] = arc_arg.slice(index1).matchAll(new RegExp(REGEXP_STR_FLAG, "g"));
        const index2 = index1 + _index2 + sweep_flag_str.length;
        const [large_arc_flag, sweep_flag] = mapL(Number, [
          large_arc_flag_str,
          sweep_flag_str,
        ]);

        const [x, y] = parseCoordinatePair(arc_arg.slice(index2));

        return [rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y];
      })
    );
    return { command, parameters: parsed_parameters };
  }

  // command === "z" or "Z"
  return { command, parameters: [] };
};

/**
 * Convert path command-parameters iterable from relative one to absolute one.
 *
 * This function will not validate input data!
 * Please check yourself first!
 *
 * @param {Iterator<{command: string, parameters: Array<Parameter>}, undefined, *>} path_command_parameters_iter
 * @returns {Generator<{command: string, parameters: Array<Parameter>}, undefined, *>}
 */
export function* $$convertPathCommandParametersRelativeToAbsoluteL(
  path_command_parameters_iter
) {
  path_command_parameters_iter = toIter(path_command_parameters_iter);

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
 * "Z", "H", "V" -> "L"
 * "S" -> "C"
 * "T" -> "Q"
 *
 * This function will not validate input data!
 * Please check yourself first!
 *
 * @param {Iterator<{command: string, parameters: Array<Parameter>}, undefined, *>} path_command_parameters_iter
 * @returns {Generator<{command: string, parameters: Array<Parameter>}, undefined, *>}
 */
export function* $$compressPathCommandL(path_command_parameters_iter) {
  path_command_parameters_iter = toIter(path_command_parameters_iter);

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
      } = reduce(
        (acc, [[x2, y2], [x, y]]) => {
          let x1;
          let y1;
          if (equals2(path_command_parameters1.command, "C")) {
            const [, [old_x2, old_y2]] = last(
              path_command_parameters1.parameters
            );
            x1 = 2 * acc.cpx - old_x2;
            y1 = 2 * acc.cpy - old_y2;
          } else {
            x1 = acc.cpx;
            y1 = acc.cpy;
          }

          acc.parameters.push([
            [x1, y1],
            [x2, y2],
            [x, y],
          ]);

          acc.cpx = x;
          acc.cpy = y;
          return acc;
        },
        { parameters: [], cpx, cpy },
        path_command_parameters2.parameters
      );
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
      } = reduce(
        (acc, [x, y]) => {
          let x1;
          let y1;
          if (equals2(path_command_parameters1.command, "Q")) {
            const [[old_x1, old_y1]] = last(
              path_command_parameters1.parameters
            );
            x1 = 2 * acc.cpx - old_x1;
            y1 = 2 * acc.cpy - old_y1;
          } else {
            x1 = cpx;
            y1 = cpy;
          }

          acc.parameters.push([
            [x1, y1],
            [x, y],
          ]);

          acc.cpx = x;
          acc.cpy = y;
          return acc;
        },
        { parameters: [], cpx, cpy },
        path_command_parameters2.parameters
      );
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
    [cpx, cpy] = [ipx, ipy];
    path_command_parameters1 = { command: "L", parameters: [[ipx, ipy]] };
    yield path_command_parameters1;
  }
}

/**
 * Parse path data string to JSON style javascript array.
 *
 * @param {string=} d_str - path data
 * @throws {InvalidArgumentsError}
 */
export const $$parsePathDate = (d_str) => {
  if (isNil(d_str)) {
    return [];
  }

  if (!$$isValidPathData(d_str)) {
    throw new InvalidArgumentsError(FN_PATH, 1);
  }

  return go(
    $$splitPathDataByCommandL(d_str),
    mapL($$parsePathCommandParameters),
    $$convertPathCommandParametersRelativeToAbsoluteL,
    $$compressPathCommandL,
    // flatMapL(flatPathSegL)
    (a) => [...a]
  );
};
