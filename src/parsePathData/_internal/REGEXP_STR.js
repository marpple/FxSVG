import { constant, go, join, mapL, rangeL } from "fxjs2";

export const REGEXP_STR_COMMAND = `[MmZzLlHhVvCcSsQqTtAa]`;

export const REGEXP_STR_WSP = `\\s`;
export const REGEXP_STR_COMMA = `,`;
/** @type {string} */
export const REGEXP_STR_COMMA_WSP = go(
  [
    `${REGEXP_STR_WSP}+${REGEXP_STR_COMMA}?${REGEXP_STR_WSP}*`,
    `${REGEXP_STR_COMMA}${REGEXP_STR_WSP}*`,
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
    `${REGEXP_STR_DIGIT_SEQ}+\\.`,
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
export const REGEXP_STR_COORDINATE_SEQ = `(?:${REGEXP_STR_COORDINATE}(?:${REGEXP_STR_COMMA_WSP}?${REGEXP_STR_COORDINATE})*)`;

/** @type {string} */
export const REGEXP_STR_COORDINATE_PAIR = go(
  rangeL(2),
  mapL(constant(REGEXP_STR_COORDINATE)),
  join(`${REGEXP_STR_COMMA_WSP}?`),
  (s) => `(?:${s})`
);
export const REGEXP_STR_COORDINATE_PAIR_SEQ = `(?:${REGEXP_STR_COORDINATE_PAIR}(?:${REGEXP_STR_COMMA_WSP}?${REGEXP_STR_COORDINATE_PAIR})*)`;

/** @type {string} */
export const REGEXP_STR_COORDINATE_PAIR_DOUBLE = go(
  rangeL(2),
  mapL(constant(REGEXP_STR_COORDINATE_PAIR)),
  join(`${REGEXP_STR_COMMA_WSP}?`),
  (s) => `(?:${s})`
);
export const REGEXP_STR_COORDINATE_PAIR_DOUBLE_SEQ = `(?:${REGEXP_STR_COORDINATE_PAIR_DOUBLE}(?:${REGEXP_STR_COMMA_WSP}?${REGEXP_STR_COORDINATE_PAIR_DOUBLE})*)`;

/** @type {string} */
export const REGEXP_STR_COORDINATE_PAIR_TRIPLET = go(
  rangeL(3),
  mapL(constant(REGEXP_STR_COORDINATE_PAIR)),
  join(`${REGEXP_STR_COMMA_WSP}?`),
  (s) => `(?:${s})`
);
export const REGEXP_STR_COORDINATE_PAIR_TRIPLET_SEQ = `(?:${REGEXP_STR_COORDINATE_PAIR_TRIPLET}(?:${REGEXP_STR_COMMA_WSP}?${REGEXP_STR_COORDINATE_PAIR_TRIPLET})*)`;

/** @type {string} */
export const REGEXP_STR_ELLIPTICAL_ARC_ARG = go(
  rangeL(3),
  mapL(constant(REGEXP_STR_NUMBER)),
  join(`${REGEXP_STR_COMMA_WSP}?`),
  (s) => `${s}${REGEXP_STR_COMMA_WSP}`,
  (s) =>
    go(
      rangeL(2),
      mapL(constant(REGEXP_STR_FLAG)),
      join(`${REGEXP_STR_COMMA_WSP}?`),
      (t) => `${s}${t}`
    ),
  (s) => `${s}${REGEXP_STR_COMMA_WSP}?${REGEXP_STR_COORDINATE_PAIR}`,
  (s) => `(?:${s})`
);
export const REGEXP_STR_ELLIPTICAL_ARC_ARG_SEQ = `(?:${REGEXP_STR_ELLIPTICAL_ARC_ARG}(?:${REGEXP_STR_COMMA_WSP}?${REGEXP_STR_ELLIPTICAL_ARC_ARG})*)`;
