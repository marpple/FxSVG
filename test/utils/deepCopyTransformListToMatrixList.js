import { go, map, mapL } from "fxjs2";
import { $$createSVGMatrix } from "../../src/createSVGMatrix/createSVGMatrix.index.js";

export const deepCopyTransformListToMatrixList = (transform_list) =>
  go(
    transform_list,
    mapL(({ matrix: m }) => m),
    mapL(({ a, b, c, d, e, f }) => ({ a, b, c, d, e, f })),
    map($$createSVGMatrix())
  );
