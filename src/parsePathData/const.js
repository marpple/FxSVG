import { go, join, mapL } from "fxjs2";

export const FN_PATH = `$$parsePathData`;
export const FN_PATH_PARSE_COORDINATE_SEQ = `$$parseCoordinateSeqL`;
export const FN_PATH_PARSE_PATH_COMMAND_PARAMETERS = `$$parsePathCommandParameters`;

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
/** @type {string} */
export const REGEXP_STR_NON_NEGATIVE_NUMBER = go(
  [REGEXP_STR_FLOATING_POINT_CONST, REGEXP_STR_DIGIT_SEQ],
  join("|"),
  (s) => `(?:${s})`
);
export const REGEXP_STR_NUMBER = `(?:${REGEXP_STR_SIGN}?${REGEXP_STR_NON_NEGATIVE_NUMBER})`;
