import { defaultTo } from "fxjs/esm";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";

export const $$updateRotateTransform = ({ angle, cx = 0, cy = 0 } = {}) => (
  transform
) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }

  transform.setRotate(defaultTo(transform.angle, angle), cx, cy);
  return transform;
};
