import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initTranslateTransform = ({
  tx = 0,
  ty = 0,
  index = 0,
} = {}) => ($el, $svg = $$getSVG()) => {
  const transform = $$createSVGTransformTranslate({ tx, ty })($svg);
  $$getBaseTransformList($el).insertItemBefore(transform, index);
  return transform;
};
