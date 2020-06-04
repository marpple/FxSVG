import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initMatrixTransform = ($svg = $$getSVG()) => (
  $el,
  { matrix = $$createSVGMatrix()(), index = 0 } = {}
) =>
  $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformMatrix($svg)({ matrix }),
    index
  );
