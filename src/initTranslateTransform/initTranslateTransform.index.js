import { curry } from "fxjs2";
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

export const $$initTranslateTransform2 = ({
  tx = 0,
  ty = 0,
  index = 0,
} = {}) => ($el, $svg = $$getSVG()) =>
  $$getBaseTransformList($el).insertItemBefore(
    $$createSVGTransformTranslate($svg)({ tx, ty }),
    index
  );

export const $$initTranslateTransform3 = curry(
  ({ tx = 0, ty = 0, index = 0 } = {}, $el, $svg = $$getSVG()) =>
    $$getBaseTransformList($el).insertItemBefore(
      $$createSVGTransformTranslate($svg)({ tx, ty }),
      index
    )
);
