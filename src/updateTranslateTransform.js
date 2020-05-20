import { $$isTranslateSVGTransform } from "./isTranslateSVGTransform.js";

export const $$updateTranslateTransform = (transform, { tx, ty }) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }
  transform.setTranslate(
    tx == null ? transform.matrix.e : tx,
    ty == null ? transform.matrix.f : ty
  );
  return transform;
};
