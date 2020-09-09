import {
  equals2,
  go,
  head,
  isNil,
  isString,
  last,
  mapL,
  reduce,
  toIter,
} from "fxjs2";
import { InvalidArgumentsError } from "../Errors/InvalidArgumentsError.js";
import { parseParameters } from "./_internal/parseParameters.js";
import { splitByPathSeg } from "./_internal/splitByPathSeg.js";
import { FN_PATH } from "./const.js";

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

  // TODO RegExp 이용한 validation

  return go(
    splitByPathSeg(d_str),
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
          const { parameters } = reduce(
            (acc, [dx, dy]) => {
              acc.x += dx;
              acc.y += dy;
              acc.parameters.push([acc.x, acc.y]);
              return acc;
            },
            { parameters: [], x: cpx, y: cpy },
            path_seg.parameters
          );
          [ipx, ipy] = head(parameters);
          [cpx, cpy] = last(parameters);
          yield { command: "M", parameters };
          continue;
        }

        if (equals2(path_seg.command, "L")) {
          [cpx, cpy] = last(path_seg.parameters);
          yield path_seg;
          continue;
        }

        if (equals2(path_seg.command, "l")) {
          const { parameters } = reduce(
            (acc, [dx, dy]) => {
              acc.x += dx;
              acc.y += dy;
              acc.parameters.push([acc.x, acc.y]);
              return acc;
            },
            { parameters: [], x: cpx, y: cpy },
            path_seg.parameters
          );
          [cpx, cpy] = last(parameters);
          yield { command: "L", parameters };
          continue;
        }

        if (equals2(path_seg.command, "H")) {
          cpx = last(path_seg.parameters);
          yield path_seg;
          continue;
        }

        if (equals2(path_seg.command, "h")) {
          const { parameters } = reduce(
            (acc, dx) => {
              acc.x += dx;
              acc.parameters.push(acc.x);
              return acc;
            },
            { parameters: [], x: cpx },
            path_seg.parameters
          );
          cpx = last(parameters);
          yield { command: "H", parameters };
          continue;
        }

        if (equals2(path_seg.command, "V")) {
          cpy = last(path_seg.parameters);
          yield path_seg;
          continue;
        }

        if (equals2(path_seg.command, "v")) {
          const { parameters } = reduce(
            (acc, dy) => {
              acc.y += dy;
              acc.parameters.push(acc.y);
              return acc;
            },
            { parameters: [], y: cpy },
            path_seg.parameters
          );
          cpy = last(parameters);
          yield { command: "V", parameters };
          continue;
        }

        if (equals2(path_seg.command, "C")) {
          continue;
        }

        if (equals2(path_seg.command, "c")) {
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
