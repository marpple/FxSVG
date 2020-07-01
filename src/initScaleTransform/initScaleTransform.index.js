import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initScaleTransform = ({
  sx = 1,
  sy = 1,
  cx = 0,
  cy = 0,
  index = 0,
} = {}) => ($el, $svg = $$getSVG()) => {
  const transform_list = $$getBaseTransformList($el);
  const positive_translate_transform = $$createSVGTransformTranslate({
    tx: cx,
    ty: cy,
  })($svg);
  const negative_translate_transform = $$createSVGTransformTranslate({
    tx: -cx,
    ty: -cy,
  })($svg);
  const scale_transform = $$createSVGTransformScale({ sx, sy })($svg);

  transform_list.insertItemBefore(negative_translate_transform, index);
  transform_list.insertItemBefore(scale_transform, index);
  transform_list.insertItemBefore(positive_translate_transform, index);

  return scale_transform;
};
