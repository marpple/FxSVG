import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$appendTranslateTransform = ({ tx = 0, ty = 0 } = {}) => (
  transform
) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }

  const { e: prev_tx, f: prev_ty } = transform.matrix;
  transform.setTranslate(prev_tx + tx, prev_ty + ty);
  return transform;
};
