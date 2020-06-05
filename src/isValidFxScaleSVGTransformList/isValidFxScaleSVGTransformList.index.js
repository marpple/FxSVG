import { go, mapL, rangeL } from "fxjs2";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$isValidFxScaleSVGTransformList = (
  transform_list,
  { index = 0 } = {}
) =>
  index > 0 &&
  index + 1 < transform_list.numberOfItems &&
  go(
    rangeL(3),
    mapL((i) => index - 1 + i),
    mapL((i) => transform_list.getItem(i)),
    ([t1, t2, t3]) =>
      $$isTranslateSVGTransform(t1) &&
      $$isScaleSVGTransform(t2) &&
      $$isTranslateSVGTransform(t3) &&
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
