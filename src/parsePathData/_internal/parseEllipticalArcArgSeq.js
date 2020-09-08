import { go, head, map, mapL } from "fxjs2";
import { parseCoordinatePair } from "./parseCoordinatePair.js";
import {
  REGEXP_STR_ELLIPTICAL_ARC_ARG,
  REGEXP_STR_FLAG,
  REGEXP_STR_NUMBER,
} from "./REGEXP_STR.js";

/**
 * @typedef {Array<number>} EllipticalArcArg
 * @description [rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y]
 *              rx, ry, x_axis_rotation, x, y : number
 *              large_arc_flag, sweep_flag : 0 or 1
 */

/**
 * @param {string} s
 * @returns {EllipticalArcArg}
 */
const parseEllipticalArcArg = (s) => {
  const [
    [rx_str],
    [ry_str],
    { 0: x_axis_rotation_str, index: _index1 },
  ] = s.matchAll(new RegExp(REGEXP_STR_NUMBER, "g"));
  const index1 = _index1 + x_axis_rotation_str.length;
  const [rx, ry, x_axis_rotation] = mapL(Number, [
    rx_str,
    ry_str,
    x_axis_rotation_str,
  ]);

  const [[large_arc_flag_str], { 0: sweep_flag_str, index: _index2 }] = s
    .slice(index1)
    .matchAll(new RegExp(REGEXP_STR_FLAG, "g"));
  const index2 = index1 + _index2 + sweep_flag_str.length;
  const [large_arc_flag, sweep_flag] = mapL(Number, [
    large_arc_flag_str,
    sweep_flag_str,
  ]);

  const [x, y] = parseCoordinatePair(s.slice(index2));

  return [rx, ry, x_axis_rotation, large_arc_flag, sweep_flag, x, y];
};

/**
 * @param {string} s
 * @returns {Array<EllipticalArcArg>}
 */
export const parseEllipticalArcArgSeq = (s) =>
  go(
    s.matchAll(new RegExp(REGEXP_STR_ELLIPTICAL_ARC_ARG, "g")),
    mapL(head),
    map(parseEllipticalArcArg)
  );
