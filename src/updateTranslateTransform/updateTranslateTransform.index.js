import { defaultTo } from "fxjs2";
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

export const $$updateTranslateTransform2 = ({ tx, ty } = {}) => (transform) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }

  transform.setTranslate(
    defaultTo(transform.matrix.e, tx),
    defaultTo(transform.matrix.f, ty)
  );
  return transform;
};

export const $$updateTranslateTransform3 = ({ tx, ty } = {}, transform) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }

  transform.setTranslate(
    defaultTo(transform.matrix.e, tx),
    defaultTo(transform.matrix.f, ty)
  );
  return transform;
};
