import { $$createSVGTransform } from "./createSVGTransform.js";
import { $$getSVG } from "./getSetSVG.js";

export const $$createSVGTransformMatrix = ($svg = $$getSVG()) => (matrix) => {
  const transform = $$createSVGTransform($svg);
  transform.setMatrix(matrix);
  return transform;
};
