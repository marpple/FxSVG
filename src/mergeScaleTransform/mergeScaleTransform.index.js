import { each, go, mapL, rangeL, reduce } from "fxjs/esm";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$isValidFxScaleSVGTransformList } from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.index.js";

export const $$mergeScaleTransform = ({ index = 1 } = {}) => (
  $el,
  $svg = $$getSVG()
) => {
  const transform_list = $$getBaseTransformList($el);
  if (!$$isValidFxScaleSVGTransformList({ index })(transform_list)) {
    return $el;
  }

  const merged_transform = go(
    rangeL(3),
    mapL((i) => index - 1 + i),
    mapL((i) => transform_list.getItem(i)),
    mapL(({ matrix }) => matrix),
    reduce((m1, m2) => m1.multiply(m2)),
    (matrix) => $$createSVGTransformMatrix({ matrix })($svg)
  );
  each(() => transform_list.removeItem(index - 1), rangeL(3));
  transform_list.insertItemBefore(merged_transform, index - 1);
  return $el;
};
