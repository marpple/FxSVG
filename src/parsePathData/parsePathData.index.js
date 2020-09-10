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
  toIter,
} from "fxjs2";
import { InvalidArgumentsError } from "../Errors/InvalidArgumentsError.js";
import { parseParameters } from "./_internal/parseParameters.js";
import {
  REGEXP_STR_COMMAND,
  REGEXP_STR_SVG_PATH,
} from "./_internal/REGEXP_STR.js";
import { FN_PATH } from "./const.js";

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
 * Parse path data string to JSON style javascript array.
 *
 * @param {string=} d_str - path data
 * @throws {InvalidArgumentsError}
 */
export const $$parsePathDate = (d_str) => {
  if (isNil(d_str)) {
    return [];
  }

  if (!isString(d_str)) {
    throw new InvalidArgumentsError(
      FN_PATH,
      `d_str`,
      `"d_str" should be one of string, null, undefined.`
    );
  }

  d_str = d_str.trim();

  if (!d_str) {
    return [];
  }

  if (!$$isValidPathData(d_str)) {
    throw new InvalidArgumentsError(
      FN_PATH,
      `d_str`,
      `"d_str" is invalid format path data strin.`
    );
  }

  return go(
    $$splitPathDataByCommandL(d_str),
    mapL(parseParameters),
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
