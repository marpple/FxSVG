import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";

export const $$updateScaleTransform = (
  transform,
  { sx = transform.matrix.a, sy = transform.matrix.d } = {}
) => {
  if (!$$isScaleSVGTransform(transform)) {
    return transform;
  }

  transform.setScale(sx, sy);
  return transform;
};
