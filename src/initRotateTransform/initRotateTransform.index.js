import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initRotateTransform = ({
  angle = 0,
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
  const rotate_transform = $$createSVGTransformRotate({ angle })($svg);

  transform_list.insertItemBefore(negative_translate_transform, index);
  transform_list.insertItemBefore(rotate_transform, index);
  transform_list.insertItemBefore(positive_translate_transform, index);

  return rotate_transform;
};
