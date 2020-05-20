import { $$createSVGTransform } from "./createSVGTransform.js";

export const $$createSVGTransformMatrix = (matrix) => {
  const transform = $$createSVGTransform();
  transform.setMatrix(matrix);
  return transform;
};
