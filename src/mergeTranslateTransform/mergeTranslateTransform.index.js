import { curry, each, go, mapL, rangeL } from "fxjs2";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$mergeTranslateTransform = ($svg = $$getSVG()) => (
  $el,
  { index = 0, x_name = "x", y_name = "y" } = {}
) => {
  const base_tl = $$getBaseTransformList($el);
  if (index > base_tl.numberOfItems - 1 || index < 0) {
    return $el;
  }

  const transform = base_tl.getItem(index);
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

  base_tl.removeItem(index);

  go(
    rangeL(base_tl.numberOfItems),
    mapL((i) => base_tl.getItem(i)),
    mapL((t) => [
      $$createSVGTransformTranslate($svg)({ tx, ty }),
      t,
      $$createSVGTransformTranslate($svg)({ tx: -tx, ty: -ty }),
    ]),
    each(([t1, t2, t3]) => {
      const matrix = t1.matrix.multiply(t2.matrix).multiply(t3.matrix);
      t2.setMatrix(matrix);
    })
  );

  return $el;
};

export const $$mergeTranslateTransform2 = ({
  index = 0,
  x_name = "x",
  y_name = "y",
} = {}) => ($el, $svg = $$getSVG()) => {
  const base_tl = $$getBaseTransformList($el);
  if (index > base_tl.numberOfItems - 1 || index < 0) {
    return $el;
  }

  const transform = base_tl.getItem(index);
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

  base_tl.removeItem(index);

  go(
    rangeL(base_tl.numberOfItems),
    mapL((i) => base_tl.getItem(i)),
    mapL((t) => [
      $$createSVGTransformTranslate($svg)({ tx, ty }),
      t,
      $$createSVGTransformTranslate($svg)({ tx: -tx, ty: -ty }),
    ]),
    each(([t1, t2, t3]) => {
      const matrix = t1.matrix.multiply(t2.matrix).multiply(t3.matrix);
      t2.setMatrix(matrix);
    })
  );

  return $el;
};

export const $$mergeTranslateTransform3 = curry(
  ({ index = 0, x_name = "x", y_name = "y" } = {}, $el, $svg = $$getSVG()) => {
    const base_tl = $$getBaseTransformList($el);
    if (index > base_tl.numberOfItems - 1 || index < 0) {
      return $el;
    }

    const transform = base_tl.getItem(index);
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

    base_tl.removeItem(index);

    go(
      rangeL(base_tl.numberOfItems),
      mapL((i) => base_tl.getItem(i)),
      mapL((t) => [
        $$createSVGTransformTranslate($svg)({ tx, ty }),
        t,
        $$createSVGTransformTranslate($svg)({ tx: -tx, ty: -ty }),
      ]),
      each(([t1, t2, t3]) => {
        const matrix = t1.matrix.multiply(t2.matrix).multiply(t3.matrix);
        t2.setMatrix(matrix);
      })
    );

    return $el;
  }
);
