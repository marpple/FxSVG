import { curry, defaultTo } from "fxjs2";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";

export const $$updateRotateTransform = (
  transform,
  { angle = transform.angle, cx = 0, cy = 0 } = {}
) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }

  transform.setRotate(angle, cx, cy);
  return transform;
};

export const $$updateRotateTransform2 = ({ angle, cx = 0, cy = 0 } = {}) => (
  transform
) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }

  transform.setRotate(defaultTo(transform.angle, angle), cx, cy);
  return transform;
};

export const $$updateRotateTransform3 = curry(
  ({ angle, cx = 0, cy = 0 } = {}, transform) => {
    if (!$$isRotateSVGTransform(transform)) {
      return transform;
    }

    transform.setRotate(defaultTo(transform.angle, angle), cx, cy);
    return transform;
  }
);
