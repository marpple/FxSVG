import { defaultTo } from "fxjs2";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initMatrixTransform = ({ matrix, index = 0 } = {}) => (
  $el,
  $svg = $$getSVG()
) => {
  matrix = defaultTo($$createSVGMatrix()($svg), matrix);
  const transform = $$createSVGTransformMatrix({ matrix })($svg);
  $$getBaseTransformList($el).insertItemBefore(transform, index);
  return transform;
};
