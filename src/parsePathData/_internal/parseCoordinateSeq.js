import { go, head, map, mapL } from "fxjs2";
import { REGEXP_STR_COORDINATE } from "./REGEXP_STR.js";

/**
 * @typedef {number} Coordinate
 */

/**
 * @param {string} s
 * @returns {Array<Coordinate>}
 */
export const parseCoordinateSeq = (s) =>
  go(
    s.matchAll(new RegExp(REGEXP_STR_COORDINATE, "g")),
    mapL(head),
    map(Number)
  );
