import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$initTranslateTransform = ($svg = $$getSVG()) => (
  $el,
  { tx = 0, ty = 0, index = 0 } = {}
) =>
  $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx, ty }),
    index
  );
