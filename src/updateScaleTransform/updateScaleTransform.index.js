import { curry, defaultTo } from "fxjs2";
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

export const $$updateScaleTransform2 = ({ sx, sy } = {}) => (transform) => {
  if (!$$isScaleSVGTransform(transform)) {
    return transform;
  }

  transform.setScale(
    defaultTo(transform.matrix.a, sx),
    defaultTo(transform.matrix.d, sy)
  );
  return transform;
};

export const $$updateScaleTransform3 = curry(({ sx, sy } = {}, transform) => {
  if (!$$isScaleSVGTransform(transform)) {
    return transform;
  }

  transform.setScale(
    defaultTo(transform.matrix.a, sx),
    defaultTo(transform.matrix.d, sy)
  );
  return transform;
});
