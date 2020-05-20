import { $$getSVG } from "./getSetSVG.js";

export const $$createSVGMatrix = ({
  a = 1,
  b = 0,
  c = 0,
  d = 1,
  e = 0,
  f = 0,
} = {}) => {
  const matrix = $$getSVG().createSVGMatrix();
  matrix.a = a;
  matrix.b = b;
  matrix.c = c;
  matrix.d = d;
  matrix.e = e;
  matrix.f = f;
  return matrix;
};
