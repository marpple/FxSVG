import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initRotateTransform = ($svg = $$getSVG()) => (
  $el,
  { angle = 0, cx = 0, cy = 0 } = {}
) => {
  $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx: -cx, ty: -cy }),
    0
  );
  const transform = $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformRotate($svg)({ angle }),
    0
  );
  $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx: cx, ty: cy }),
    0
  );
  return transform;
};
