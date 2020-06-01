import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";

export const $$updateScaleTransform = (transform, { sx, sy } = {}) => {
  if (!$$isScaleSVGTransform(transform)) {
    return transform;
  }

  transform.setScale(
    sx == null ? transform.matrix.a : sx,
    sy == null ? transform.matrix.d : sy
  );
  return transform;
};
