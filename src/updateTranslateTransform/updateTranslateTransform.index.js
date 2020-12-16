import { defaultTo } from "fxjs/es";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$updateTranslateTransform = ({ tx, ty } = {}) => (transform) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }

  transform.setTranslate(
    defaultTo(transform.matrix.e, tx),
    defaultTo(transform.matrix.f, ty)
  );
  return transform;
};
