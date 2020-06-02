import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformMatrix = ($svg = $$getSVG()) => ({
  matrix = $$createSVGMatrix($svg)(),
} = {}) => {
  const transform = $$createSVGTransform($svg);
  transform.setMatrix(matrix);
  return transform;
};
