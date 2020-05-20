import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate.js";
import { $$getBaseTransformList } from "./getBaseTransformList.js";
import { $$getSVG } from "./getSetSVG.js";
import { $$isTranslateSVGTransform } from "./isTranslateSVGTransform.js";

export const $$mergeTranslateTransform = ($svg = $$getSVG()) => (
  $el,
  { x_name = "x", y_name = "y" } = {}
) => {
  const base_tl = $$getBaseTransformList($el);

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
