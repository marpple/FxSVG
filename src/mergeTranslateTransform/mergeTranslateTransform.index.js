import { each, go, mapL, rangeL } from "fxjs2";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$mergeTranslateTransform = ({
  index = 0,
  x_name = "x",
  y_name = "y",
} = {}) => ($el, $svg = $$getSVG()) => {
  const base_transform_list = $$getBaseTransformList($el);
  if (index > base_transform_list.numberOfItems - 1 || index < 0) {
    return $el;
  }

  const transform = base_transform_list.getItem(index);
  if (!$$isTranslateSVGTransform(transform)) {
    return $el;
  }

  const { e: tx, f: ty } = transform.matrix;

  go(
    [
      { name: x_name, value: tx },
      { name: y_name, value: ty },
    ],
    mapL(({ name, value }) => ({
      name,
      value: `${parseFloat($el.getAttributeNS(null, name)) + value}`,
    })),
    each(({ name, value }) => $el.setAttributeNS(null, name, value))
  );

  base_transform_list.removeItem(index);

  go(
    rangeL(base_transform_list.numberOfItems),
    mapL((i) => base_transform_list.getItem(i)),
    mapL((t) => [
      $$createSVGTransformTranslate({ tx, ty })($svg),
      t,
      $$createSVGTransformTranslate({ tx: -tx, ty: -ty })($svg),
    ]),
    each(([t1, t2, t3]) => {
      const matrix = t1.matrix.multiply(t2.matrix).multiply(t3.matrix);
      t2.setMatrix(matrix);
    })
  );

  return $el;
};
