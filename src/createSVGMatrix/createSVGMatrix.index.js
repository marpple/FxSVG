import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGMatrix = ($svg = $$getSVG()) => ({
  a = 1,
  b = 0,
  c = 0,
  d = 1,
  e = 0,
  f = 0,
} = {}) => {
  const matrix = $svg.createSVGMatrix();
  matrix.a = a;
  matrix.b = b;
  matrix.c = c;
  matrix.d = d;
  matrix.e = e;
  matrix.f = f;
  return matrix;
};

export const $$createSVGMatrix2 = ({
  a = 1,
  b = 0,
  c = 0,
  d = 1,
  e = 0,
  f = 0,
} = {}) => ($svg = $$getSVG()) => {
  const matrix = $svg.createSVGMatrix();
  matrix.a = a;
  matrix.b = b;
  matrix.c = c;
  matrix.d = d;
  matrix.e = e;
  matrix.f = f;
  return matrix;
};

export const $$createSVGMatrix3 = (
  { a = 1, b = 0, c = 0, d = 1, e = 0, f = 0 } = {},
  $svg = $$getSVG()
) => {
  const matrix = $svg.createSVGMatrix();
  matrix.a = a;
  matrix.b = b;
  matrix.c = c;
  matrix.d = d;
  matrix.e = e;
  matrix.f = f;
  return matrix;
};
