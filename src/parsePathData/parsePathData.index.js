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
 * This function will not validate coordinate pair string!
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
 * This function will not validate parameters string!
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
    function* convertFirstPathSegL(path_seg_iter) {
      const { value: first_path_seg } = path_seg_iter.next();

      if (equals2(first_path_seg.command, "M")) {
        yield first_path_seg;
        yield* path_seg_iter;
        return;
      }

      if (first_path_seg.parameters.length <= 1) {
        yield { ...first_path_seg, command: "M" };
        yield* path_seg_iter;
        return;
      }

      const parameters_iter = toIter(first_path_seg.parameters);
      const [init_cpx, init_cpy] = parameters_iter.next().value;
      const { parameters } = reduce(
        (acc, [dx, dy]) => {
          acc.cpx += dx;
          acc.cpy += dy;
          acc.parameters.push([acc.cpx, acc.cpy]);
          return acc;
        },
        { parameters: [[init_cpx, init_cpy]], cpx: init_cpx, cpy: init_cpy },
        parameters_iter
      );
      yield { command: "M", parameters };
      yield* path_seg_iter;
    },
    function* convertRelativeToAbsoluteL(path_seg_iter) {
      const { value: first_path_seg } = path_seg_iter.next();

      let [ipx, ipy] = head(first_path_seg.parameters);
      let [cpx, cpy] = last(first_path_seg.parameters);

      yield first_path_seg;
      for (const path_seg of path_seg_iter) {
        if (equals2(path_seg.command, "M")) {
          [ipx, ipy] = head(path_seg.parameters);
          [cpx, cpy] = last(path_seg.parameters);
          yield path_seg;
          continue;
        }

        if (equals2(path_seg.command, "m")) {
          const { parameters, cpx: updated_cpx, cpy: updated_cpy } = reduce(
            (acc, [dx, dy]) => {
              acc.cpx += dx;
              acc.cpy += dy;
              acc.parameters.push([acc.cpx, acc.cpy]);
              return acc;
            },
            { parameters: [], cpx, cpy },
            path_seg.parameters
          );
          [ipx, ipy] = head(parameters);
          cpx = updated_cpx;
          cpy = updated_cpy;
          yield { command: "M", parameters };
          continue;
        }

        if (equals2(path_seg.command, "L")) {
          [cpx, cpy] = last(path_seg.parameters);
          yield path_seg;
          continue;
        }

        if (equals2(path_seg.command, "l")) {
          const { parameters, cpx: updated_cpx, cpy: updated_cpy } = reduce(
            (acc, [dx, dy]) => {
              acc.cpx += dx;
              acc.cpy += dy;
              acc.parameters.push([acc.cpx, acc.cpy]);
              return acc;
            },
            { parameters: [], cpx, cpy },
            path_seg.parameters
          );
          cpx = updated_cpx;
          cpy = updated_cpy;
          yield { command: "L", parameters };
          continue;
        }

        if (equals2(path_seg.command, "H")) {
          cpx = last(path_seg.parameters);
          yield path_seg;
          continue;
        }

        if (equals2(path_seg.command, "h")) {
          const { parameters, cpx: updated_cpx } = reduce(
            (acc, dx) => {
              acc.cpx += dx;
              acc.parameters.push(acc.cpx);
              return acc;
            },
            { parameters: [], cpx },
            path_seg.parameters
          );
          cpx = updated_cpx;
          yield { command: "H", parameters };
          continue;
        }

        if (equals2(path_seg.command, "V")) {
          cpy = last(path_seg.parameters);
          yield path_seg;
          continue;
        }

        if (equals2(path_seg.command, "v")) {
          const { parameters, cpy: updated_cpy } = reduce(
            (acc, dy) => {
              acc.cpy += dy;
              acc.parameters.push(acc.cpy);
              return acc;
            },
            { parameters: [], cpy },
            path_seg.parameters
          );
          cpy = updated_cpy;
          yield { command: "V", parameters };
          continue;
        }

        if (equals2(path_seg.command, "C")) {
          [, , [cpx, cpy]] = last(path_seg.parameters);
          yield path_seg;
          continue;
        }

        if (equals2(path_seg.command, "c")) {
          const { parameters, cpx: updated_cpx, cpy: updated_cpy } = reduce(
            (acc, parameter) => {
              const updated_parameter = map(
                ([x, y]) => [x + acc.x, y + acc.y],
                parameter
              );
              acc.parameters.push(updated_parameter);
              acc.cpx = updated_parameter[2][0];
              acc.cpy = updated_parameter[2][1];
              return acc;
            },
            { parameters: [], cpx, cpy },
            path_seg.parameters
          );
          cpx = updated_cpx;
          cpy = updated_cpy;
          yield { command: "C", parameters };
          continue;
        }

        if (equals2(path_seg.command, "S")) {
          continue;
        }

        if (equals2(path_seg.command, "s")) {
          continue;
        }

        if (equals2(path_seg.command, "Q")) {
          continue;
        }

        if (equals2(path_seg.command, "q")) {
          continue;
        }

        if (equals2(path_seg.command, "T")) {
          continue;
        }

        if (equals2(path_seg.command, "t")) {
          continue;
        }

        if (equals2(path_seg.command, "A")) {
          continue;
        }

        if (equals2(path_seg.command, "a")) {
          continue;
        }

        // command === "z" or "Z"
        [cpx, cpy] = [ipx, ipy];
        yield { command: "Z", parameters: [] };
      }
    },
    // convertCommandZL, // Z -> L
    // convertCommandSL, // S -> C
    // convertCommandTL, // T -> Q
    // flatMapL(flatPathSegL)
    (a) => [...a]
  );
};
