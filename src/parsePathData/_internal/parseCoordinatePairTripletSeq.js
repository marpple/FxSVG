import { go, head, map, mapL, take } from "fxjs2";
import { parseCoordinatePair } from "./parseCoordinatePair.js";
import {
  REGEXP_STR_COORDINATE_PAIR,
  REGEXP_STR_COORDINATE_PAIR_TRIPLET,
} from "./REGEXP_STR.js";

/**
 * @typedef {Array<CoordinatePair>} CoordinatePairTriplet
 * @description Array of three "CoordinatePair"s.
 */

/**
 * @param {string} s
 * @returns {CoordinatePairTriplet}
 */
const parseCoordinatePairTriplet = (s) =>
  go(
    s.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR, "g")),
    mapL(head),
    mapL(parseCoordinatePair),
    take(3)
  );

/**
 * @param {string} s
 * @returns {Array<CoordinatePairTriplet>}
 */
export const parseCoordinatePairTripletSeq = (s) =>
  go(
    s.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR_TRIPLET, "g")),
    mapL(head),
    map(parseCoordinatePairTriplet)
  );
