import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";

export const $$appendRotateTransform = ({ angle = 0 } = {}) => (transform) => {
  if (!$$isRotateSVGTransform(transform)) {
    return transform;
  }

  const { angle: prev_angle } = transform;
  transform.setRotate(prev_angle + angle, 0, 0);
  return transform;
};
