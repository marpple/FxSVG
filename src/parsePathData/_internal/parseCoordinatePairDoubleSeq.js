import { go, head, map, mapL, take } from "fxjs2";
import { parseCoordinatePair } from "./parseCoordinatePair.js";
import {
  REGEXP_STR_COORDINATE_PAIR,
  REGEXP_STR_COORDINATE_PAIR_DOUBLE,
} from "./REGEXP_STR.js";

/**
 * @typedef {Array<CoordinatePair>} CoordinatePairDouble
 * @description Array of two "CoordinatePair"s.
 */

/**
 * @param {string} s
 * @returns {CoordinatePairDouble}
 */
const parseCoordinatePairDouble = (s) =>
  go(
    s.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR, "g")),
    mapL(head),
    mapL(parseCoordinatePair),
    take(2)
  );

/**
 * @param {string} s
 * @returns {Array<CoordinatePairDouble>}
 */
export const parseCoordinatePairDoubleSeq = (s) =>
  go(
    s.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR_DOUBLE, "g")),
    mapL(head),
    map(parseCoordinatePairDouble)
  );
