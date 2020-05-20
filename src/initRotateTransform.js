import { $$createSVGTransformRotate } from "./createSVGTransformRotate.js";
import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate.js";
import { $$getBaseTransformList } from "./getBaseTransformList.js";
import { $$getSVG } from "./getSetSVG.js";

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
