import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initRotateTransform = ($svg = $$getSVG()) => (
  $el,
  { angle = 0, cx = 0, cy = 0, index = 0 } = {}
) => {
  const transform_list = $$getBaseTransformList($el);

  transform_list.insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx: -cx, ty: -cy }),
    index
  );
  const transform = transform_list.insertItemBefore(
    $$createSVGTransformRotate($svg)({ angle }),
    index
  );
  transform_list.insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx: cx, ty: cy }),
    index
  );

  return transform;
};
