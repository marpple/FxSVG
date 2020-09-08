import { go, head, mapL, take } from "fxjs2";
import { REGEXP_STR_COORDINATE } from "./REGEXP_STR.js";

/**
 * @typedef {Array<number>} CoordinatePair
 * @description Array of two numbers.
 *              ex) [10, 20]
 */

/**
 * @param {string} s
 * @returns {CoordinatePair}
 */
export const parseCoordinatePair = (s) =>
  go(
    s.matchAll(new RegExp(REGEXP_STR_COORDINATE, "g")),
    mapL(head),
    mapL(Number),
    take(2)
  );
