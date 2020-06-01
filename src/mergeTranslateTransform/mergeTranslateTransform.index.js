import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$mergeTranslateTransform = ($svg = $$getSVG()) => (
  $el,
  { x_name = "x", y_name = "y" } = {}
) => {
  const base_tl = $$getBaseTransformList($el);
  if (base_tl.numberOfItems < 1) {
    return $el;
  }

  const last_transform = base_tl.getItem(0);
  if (!$$isTranslateSVGTransform(last_transform)) {
    return $el;
  }

  const { e: tx, f: ty } = last_transform.matrix;

  $el.setAttributeNS(
    null,
    x_name,
    `${parseFloat($el.getAttribute(x_name)) + tx}`
  );
  $el.setAttributeNS(
    null,
    y_name,
    `${parseFloat($el.getAttribute(y_name)) + ty}`
  );

  base_tl.removeItem(0);

  for (const transform of base_tl) {
    const t1 = $$createSVGTransformTranslate($svg)({ tx, ty });
    const t2 = $$createSVGTransformTranslate($svg)({ tx: -tx, ty: -ty });

    const matrix = t1.matrix.multiply(transform.matrix).multiply(t2.matrix);
    transform.setMatrix(matrix);
  }

  return $el;
};
