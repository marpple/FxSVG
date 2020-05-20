import { $$createSVGTransformRotate } from "./createSVGTransformRotate.js";
import { $$getBaseTransformList } from "./getBaseTransformList.js";
import { $$getSVG } from "./getSetSVG.js";
import { $$isRotateSVGTransform } from "./isRotateSVGTransform.js";
import { $$isTranslateSVGTransform } from "./isTranslateSVGTransform.js";

export const $$mergeRotateTransform = ($svg = $$getSVG()) => ($el) => {
  const base_tl = $$getBaseTransformList($el);

  const transform1 = base_tl.getItem(0);
  const transform2 = base_tl.getItem(1);
  const transform3 = base_tl.getItem(2);
  if (
    !$$isTranslateSVGTransform(transform1) ||
    !$$isRotateSVGTransform(transform2) ||
    !$$isTranslateSVGTransform(transform3) ||
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

  for (let i = 0; i < 3; i++) {
    base_tl.removeItem(0);
  }
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
