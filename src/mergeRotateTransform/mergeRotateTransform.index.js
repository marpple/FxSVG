import { each, mapL, rangeL } from "fxjs2";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$mergeRotateTransform = ($svg = $$getSVG()) => ($el) => {
  const base_tl = $$getBaseTransformList($el);
  if (base_tl.numberOfItems < 3) {
    return $el;
  }

  const [transform1, transform2, transform3] = mapL(
    (i) => base_tl.getItem(i),
    rangeL(3)
  );
  if (
    !$$isTranslateSVGTransform(transform1) ||
    !$$isRotateSVGTransform(transform2) ||
    !$$isTranslateSVGTransform(transform3) ||
    transform2.matrix.e !== 0 ||
    transform2.matrix.f !== 0 ||
    transform1.matrix.a !== 1 ||
    transform1.matrix.b !== 0 ||
    transform1.matrix.c !== 0 ||
    transform1.matrix.d !== 1 ||
    transform3.matrix.a !== 1 ||
    transform3.matrix.b !== 0 ||
    transform3.matrix.c !== 0 ||
    transform3.matrix.d !== 1 ||
    transform1.matrix.e + transform3.matrix.e !== 0 ||
    transform1.matrix.f + transform3.matrix.f !== 0
  ) {
    return $el;
  }

  each(() => base_tl.removeItem(0), rangeL(3));
  base_tl.insertItemBefore(
    $$createSVGTransformRotate($svg)({
      angle: transform2.angle,
      cx: transform1.matrix.e,
      cy: transform1.matrix.f,
    }),
    0
  );
  return $el;
};
