import { tap } from "fxjs2";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGMatrix = ({
  a = 1,
  b = 0,
  c = 0,
  d = 1,
  e = 0,
  f = 0,
} = {}) => ($svg = $$getSVG()) =>
  tap((matrix) => {
    matrix.a = a;
    matrix.b = b;
    matrix.c = c;
    matrix.d = d;
    matrix.e = e;
    matrix.f = f;
  })($svg.createSVGMatrix());
