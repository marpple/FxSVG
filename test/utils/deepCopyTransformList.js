import { map } from "fxjs2";
import { $$createSVGMatrix } from "../../src/createSVGMatrix/createSVGMatrix.index.js";

export const deepCopyTransformList = (transform_list) =>
  map(
    ({ matrix, type }) => ({ type, matrix: $$createSVGMatrix()(matrix) }),
    transform_list
  );
