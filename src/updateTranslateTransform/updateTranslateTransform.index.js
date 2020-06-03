import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$updateTranslateTransform = (
  transform,
  { tx = transform.matrix.e, ty = transform.matrix.f } = {}
) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }

  transform.setTranslate(tx, ty);
  return transform;
};
