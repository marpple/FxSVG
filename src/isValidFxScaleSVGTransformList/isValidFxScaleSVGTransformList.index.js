import { go, mapL, rangeL } from "fxjs2";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$isValidFxScaleSVGTransformList = ({ index = 0 } = {}) => (
  transform_list
) => {
  if (index <= 0 || index >= transform_list.numberOfItems - 1) {
    return false;
  }

  const [
    positive_translate_transform,
    scale_transform,
    negative_translate_transform,
  ] = go(
    rangeL(3),
    mapL((i) => index - 1 + i),
    mapL((i) => transform_list.getItem(i))
  );
  return (
    $$isTranslateSVGTransform(positive_translate_transform) &&
    $$isScaleSVGTransform(scale_transform) &&
    $$isTranslateSVGTransform(negative_translate_transform) &&
    positive_translate_transform.matrix.a === 1 &&
    positive_translate_transform.matrix.b === 0 &&
    positive_translate_transform.matrix.c === 0 &&
    positive_translate_transform.matrix.d === 1 &&
    negative_translate_transform.matrix.a === 1 &&
    negative_translate_transform.matrix.b === 0 &&
    negative_translate_transform.matrix.c === 0 &&
    negative_translate_transform.matrix.d === 1 &&
    positive_translate_transform.matrix.e +
      negative_translate_transform.matrix.e ===
      0 &&
    positive_translate_transform.matrix.f +
      negative_translate_transform.matrix.f ===
      0
  );
};
