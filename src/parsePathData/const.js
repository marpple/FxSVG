import { appendL, concatL, constant, go, join, mapL, rangeL } from "fxjs2";

export const FN_PATH = `$$parsePathData`;

export const REGEXP_STR_COMMAND = `[MmZzLlHhVvCcSsQqTtAa]`;
export const REGEXP_STR_WSP = `\\s`;
export const REGEXP_STR_COMMA = `,`;
/** @type {string} */
export const REGEXP_STR_COMMA_WSP = go(
  [
    `${REGEXP_STR_WSP}+`,
    `${REGEXP_STR_WSP}*${REGEXP_STR_COMMA}${REGEXP_STR_WSP}*`,
  ],
  mapL((s) => `(?:${s})`),
  join("|"),
  (s) => `(?:${s})`
);
export const REGEXP_STR_FLAG = `(?:0|1)`;
export const REGEXP_STR_SIGN = `(?:\\+|-)`;
export const REGEXP_STR_DIGIT = `\\d`;
export const REGEXP_STR_DIGIT_SEQ = `(?:${REGEXP_STR_DIGIT}+)`;
export const REGEXP_STR_EXPONENT = `(?:[eE]${REGEXP_STR_SIGN}?${REGEXP_STR_DIGIT_SEQ})`;
/** @type {string} */
export const REGEXP_STR_FRACTIONAL_CONST = go(
  [
    `${REGEXP_STR_DIGIT_SEQ}?\\.${REGEXP_STR_DIGIT_SEQ}`,
    `${REGEXP_STR_DIGIT_SEQ}\\.`,
  ],
  mapL((s) => `(?:${s})`),
  join("|"),
  (s) => `(?:${s})`
);
/** @type {string} */
export const REGEXP_STR_FLOATING_POINT_CONST = go(
  [
    `${REGEXP_STR_FRACTIONAL_CONST}${REGEXP_STR_EXPONENT}?`,
    `${REGEXP_STR_DIGIT_SEQ}${REGEXP_STR_EXPONENT}`,
  ],
  mapL((s) => `(?:${s})`),
  join("|"),
  (s) => `(?:${s})`
);
export const REGEXP_STR_INTEGER_CONST = REGEXP_STR_DIGIT_SEQ;
/** @type {string} */
export const REGEXP_STR_NON_NEGATIVE_NUMBER = go(
  [REGEXP_STR_FLOATING_POINT_CONST, REGEXP_STR_INTEGER_CONST],
  join("|"),
  (s) => `(?:${s})`
);
export const REGEXP_STR_NUMBER = `(?:${REGEXP_STR_SIGN}?${REGEXP_STR_NON_NEGATIVE_NUMBER})`;
export const REGEXP_STR_COORDINATE = REGEXP_STR_NUMBER;
export const REGEXP_STR_COORDINATE_SEQ = `(?:${REGEXP_STR_COORDINATE}(?:${REGEXP_STR_COMMA_WSP}${REGEXP_STR_COORDINATE})*)`;
/** @type {string} */
export const REGEXP_STR_COORDINATE_PAIR = go(
  rangeL(2),
  mapL(constant(REGEXP_STR_COORDINATE)),
  join(`${REGEXP_STR_COMMA_WSP}`),
  (s) => `(?:${s})`
);
export const REGEXP_STR_COORDINATE_PAIR_SEQ = `(?:${REGEXP_STR_COORDINATE_PAIR}(?:${REGEXP_STR_COMMA_WSP}${REGEXP_STR_COORDINATE_PAIR})*)`;
/** @type {string} */
export const REGEXP_STR_COORDINATE_PAIR_DOUBLE = go(
  rangeL(2),
  mapL(constant(REGEXP_STR_COORDINATE_PAIR)),
  join(`${REGEXP_STR_COMMA_WSP}`),
  (s) => `(?:${s})`
);
export const REGEXP_STR_COORDINATE_PAIR_DOUBLE_SEQ = `(?:${REGEXP_STR_COORDINATE_PAIR_DOUBLE}(?:${REGEXP_STR_COMMA_WSP}${REGEXP_STR_COORDINATE_PAIR_DOUBLE})*)`;
/** @type {string} */
export const REGEXP_STR_COORDINATE_PAIR_TRIPLET = go(
  rangeL(3),
  mapL(constant(REGEXP_STR_COORDINATE_PAIR)),
  join(`${REGEXP_STR_COMMA_WSP}`),
  (s) => `(?:${s})`
);
export const REGEXP_STR_COORDINATE_PAIR_TRIPLET_SEQ = `(?:${REGEXP_STR_COORDINATE_PAIR_TRIPLET}(?:${REGEXP_STR_COMMA_WSP}${REGEXP_STR_COORDINATE_PAIR_TRIPLET})*)`;
/** @type {string} */
export const REGEXP_STR_ELLIPTICAL_ARC_ARG = go(
  rangeL(3),
  mapL(constant(REGEXP_STR_NUMBER)),
  (number_iter) =>
    concatL(number_iter, mapL(constant(REGEXP_STR_FLAG), rangeL(2))),
  appendL(REGEXP_STR_COORDINATE_PAIR),
  join(`${REGEXP_STR_COMMA_WSP}`),
  (s) => `(?:${s})`
);
export const REGEXP_STR_ELLIPTICAL_ARC_ARG_SEQ = `(?:${REGEXP_STR_ELLIPTICAL_ARC_ARG}(?:${REGEXP_STR_COMMA_WSP}${REGEXP_STR_ELLIPTICAL_ARC_ARG})*)`;
export const REGEXP_STR_MOVE_TO_COMMAND = `(?:(?:M|m)${REGEXP_STR_WSP}*${REGEXP_STR_COORDINATE_PAIR_SEQ})`;
export const REGEXP_STR_CLOSE_PATH_COMMAND = `(?:Z|z)`;
export const REGEXP_STR_LINE_TO_COMMAND = `(?:(?:L|l)${REGEXP_STR_WSP}*${REGEXP_STR_COORDINATE_PAIR_SEQ})`;
export const REGEXP_STR_H_LINE_TO_COMMAND = `(?:(?:H|h)${REGEXP_STR_WSP}*${REGEXP_STR_COORDINATE_SEQ})`;
export const REGEXP_STR_V_LINE_TO_COMMAND = `(?:(?:V|v)${REGEXP_STR_WSP}*${REGEXP_STR_COORDINATE_SEQ})`;
export const REGEXP_STR_CURVE_TO_COMMAND = `(?:(?:C|c)${REGEXP_STR_WSP}*${REGEXP_STR_COORDINATE_PAIR_TRIPLET_SEQ})`;
export const REGEXP_STR_SMOOTH_CURVE_TO_COMMAND = `(?:(?:S|s)${REGEXP_STR_WSP}*${REGEXP_STR_COORDINATE_PAIR_DOUBLE_SEQ})`;
export const REGEXP_STR_QUADRATIC_CURVE_TO_COMMAND = `(?:(?:Q|q)${REGEXP_STR_WSP}*${REGEXP_STR_COORDINATE_PAIR_DOUBLE_SEQ})`;
export const REGEXP_STR_SMOOTH_QUADRATIC_CURVE_TO_COMMAND = `(?:(?:T|t)${REGEXP_STR_WSP}*${REGEXP_STR_COORDINATE_PAIR_SEQ})`;
export const REGEXP_STR_ELLIPTICAL_ARC_COMMAND = `(?:(?:A|a)${REGEXP_STR_WSP}*${REGEXP_STR_ELLIPTICAL_ARC_ARG_SEQ})`;
/** @type {string} */
export const REGEXP_STR_DRAW_TO_COMMAND = go(
  [
    REGEXP_STR_MOVE_TO_COMMAND,
    REGEXP_STR_CLOSE_PATH_COMMAND,
    REGEXP_STR_LINE_TO_COMMAND,
    REGEXP_STR_H_LINE_TO_COMMAND,
    REGEXP_STR_V_LINE_TO_COMMAND,
    REGEXP_STR_CURVE_TO_COMMAND,
    REGEXP_STR_SMOOTH_CURVE_TO_COMMAND,
    REGEXP_STR_QUADRATIC_CURVE_TO_COMMAND,
    REGEXP_STR_SMOOTH_QUADRATIC_CURVE_TO_COMMAND,
    REGEXP_STR_ELLIPTICAL_ARC_COMMAND,
  ],
  join("|"),
  (s) => `(?:${s})`
);
export const REGEXP_STR_SVG_PATH = `^${REGEXP_STR_WSP}*(?:${REGEXP_STR_MOVE_TO_COMMAND}(?:${REGEXP_STR_WSP}+${REGEXP_STR_DRAW_TO_COMMAND})*)*${REGEXP_STR_WSP}*$`;
