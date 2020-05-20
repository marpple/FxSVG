import { $$createSVGTransform } from "./createSVGTransform.js";

export const $$createSVGTransformScale = ({ sx = 1, sy = 1 } = {}) => {
  const transform = $$createSVGTransform();
  transform.setScale(sx, sy);
  return transform;
};
