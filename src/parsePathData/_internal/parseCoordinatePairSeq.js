import { go, head, map, mapL } from "fxjs2";
import { parseCoordinatePair } from "./parseCoordinatePair.js";
import { REGEXP_STR_COORDINATE_PAIR } from "./REGEXP_STR.js";

/**
 * @param {string} s
 * @returns {Array<CoordinatePair>}
 */
export const parseCoordinatePairSeq = (s) =>
  go(
    s.matchAll(new RegExp(REGEXP_STR_COORDINATE_PAIR, "g")),
    mapL(head),
    map(parseCoordinatePair)
  );
