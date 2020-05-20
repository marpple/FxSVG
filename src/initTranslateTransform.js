import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate.js";
import { $$getBaseTransformList } from "./getBaseTransformList.js";
import { $$getSVG } from "./getSetSVG.js";

export const $$initTranslateTransform = ($svg = $$getSVG()) => (
  $el,
  { tx = 0, ty = 0 } = {}
) =>
  $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx, ty }),
    0
  );
