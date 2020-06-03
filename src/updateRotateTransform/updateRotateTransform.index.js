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
