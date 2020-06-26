import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";

export const $$appendTranslateTransform = (
  transform,
  { tx = 0, ty = 0 } = {}
) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }

  const { e: prev_tx, f: prev_ty } = transform.matrix;
  transform.setTranslate(prev_tx + tx, prev_ty + ty);
  return transform;
};

export const $$appendTranslateTransform2 = ({ tx = 0, ty = 0 } = {}) => (
  transform
) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }

  const { e: prev_tx, f: prev_ty } = transform.matrix;
  transform.setTranslate(prev_tx + tx, prev_ty + ty);
  return transform;
};

export const $$appendTranslateTransform3 = (
  { tx = 0, ty = 0 } = {},
  transform
) => {
  if (!$$isTranslateSVGTransform(transform)) {
    return transform;
  }

  const { e: prev_tx, f: prev_ty } = transform.matrix;
  transform.setTranslate(prev_tx + tx, prev_ty + ty);
  return transform;
};
