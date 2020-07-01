import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformScale = ({ sx = 1, sy = 1 } = {}) => (
  $svg = $$getSVG()
) => {
  const transform = $$createSVGTransform($svg);
  transform.setScale(sx, sy);
  return transform;
};
