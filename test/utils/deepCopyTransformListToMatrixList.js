import { $$createSVGMatrix } from "../../src/createSVGMatrix/createSVGMatrix.index.js";

export const deepCopyTransformListToMatrixList = (transform_list) =>
  [...transform_list]
    .map(({ matrix: m }) => m)
    .map(({ a, b, c, d, e, f }) => ({ a, b, c, d, e, f }))
    .map($$createSVGMatrix());
