import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initScaleTransform = ($svg = $$getSVG()) => (
  $el,
  { sx = 1, sy = 1, cx = 0, cy = 0, index = 0 } = {}
) => {
  const transform_list = $$getBaseTransformList($el);

  transform_list.insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx: -cx, ty: -cy }),
    index
  );
  const transform = transform_list.insertItemBefore(
    $$createSVGTransformScale($svg)({ sx, sy }),
    index
  );
  transform_list.insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx: cx, ty: cy }),
    index
  );

  return transform;
};
