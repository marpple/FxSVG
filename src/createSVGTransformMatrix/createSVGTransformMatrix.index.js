import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformMatrix = ($svg = $$getSVG()) => (matrix) => {
  const transform = $$createSVGTransform($svg);
  transform.setMatrix(matrix);
  return transform;
};
