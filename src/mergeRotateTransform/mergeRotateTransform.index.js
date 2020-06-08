import { each, go, mapL, rangeL } from "fxjs2";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

const $$isValidFxRotateSVGTransformList = (transform_list, { index }) => {
  if (index > transform_list.numberOfItems - 2) {
    return false;
  }

  return go(
    rangeL(3),
    mapL((i) => index - 1 + i),
    mapL((i) => transform_list.getItem(i)),
    ([t1, t2, t3]) =>
      $$isTranslateSVGTransform(t1) &&
      $$isRotateSVGTransform(t2) &&
      $$isTranslateSVGTransform(t3) &&
      t2.matrix.e === 0 &&
      t2.matrix.f === 0 &&
      t1.matrix.a === 1 &&
      t1.matrix.b === 0 &&
      t1.matrix.c === 0 &&
      t1.matrix.d === 1 &&
      t3.matrix.a === 1 &&
      t3.matrix.b === 0 &&
      t3.matrix.c === 0 &&
      t3.matrix.d === 1 &&
      t1.matrix.e + t3.matrix.e === 0 &&
      t1.matrix.f + t3.matrix.f === 0
  );
};

export const $$mergeRotateTransform = ($svg = $$getSVG()) => (
  $el,
  { index = 1 } = {}
) => {
  const base_tl = $$getBaseTransformList($el);
  if (!$$isValidFxRotateSVGTransformList(base_tl, { index })) {
    return $el;
  }

  const { angle } = base_tl.getItem(index);
  const { e: cx, f: cy } = base_tl.getItem(index - 1).matrix;

  each(() => base_tl.removeItem(index - 1), rangeL(3));
  base_tl.insertItemBefore(
    $$createSVGTransformRotate($svg)({ angle, cx, cy }),
    index - 1
  );

  return $el;
};
