import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";

export const $$updateRotateTransform = (
  transform,
  { angle, cx = 0, cy = 0 } = {}
) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }

  transform.setRotate(angle == null ? transform.angle : angle, cx, cy);
  return transform;
};
