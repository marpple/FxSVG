import { $$createSVGTransform } from "./createSVGTransform.js";

export const $$createSVGTransformRotate = ({
  angle = 0,
  cx = 0,
  cy = 0,
} = {}) => {
  const transform = $$createSVGTransform();
  transform.setRotate(angle, cx, cy);
  return transform;
};
