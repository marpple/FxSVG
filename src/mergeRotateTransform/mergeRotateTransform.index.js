import { each, go, mapL, rangeL } from "fxjs/es";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

const $$isValidFxRotateSVGTransformList = ({ index }) => (transform_list) => {
  if (index > transform_list.numberOfItems - 2 || index < 1) {
    return false;
  }

  const [
    positive_translate_transform,
    rotate_transform,
    negative_translate_transform,
  ] = go(
    rangeL(3),
    mapL((i) => index - 1 + i),
    mapL((i) => transform_list.getItem(i))
  );

  return (
    $$isTranslateSVGTransform(positive_translate_transform) &&
    $$isRotateSVGTransform(rotate_transform) &&
    $$isTranslateSVGTransform(negative_translate_transform) &&
    rotate_transform.matrix.e === 0 &&
    rotate_transform.matrix.f === 0 &&
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

export const $$mergeRotateTransform = ({ index = 1 } = {}) => (
  $el,
  $svg = $$getSVG()
) => {
  const base_transform_list = $$getBaseTransformList($el);
  if (!$$isValidFxRotateSVGTransformList({ index })(base_transform_list)) {
    return $el;
  }

  const { angle } = base_transform_list.getItem(index);
  const { e: cx, f: cy } = base_transform_list.getItem(index - 1).matrix;

  each(() => base_transform_list.removeItem(index - 1), rangeL(3));

  const rotate_transform = $$createSVGTransformRotate({ angle, cx, cy })($svg);
  base_transform_list.insertItemBefore(rotate_transform, index - 1);

  return $el;
};
