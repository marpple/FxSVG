import { $$createSVGTransform } from "./createSVGTransform.js";
import { $$getSVG } from "./getSetSVG.js";

export const $$createSVGTransformScale = ($svg = $$getSVG()) => ({
  sx = 1,
  sy = 1,
} = {}) => {
  const transform = $$createSVGTransform($svg);
  transform.setScale(sx, sy);
  return transform;
};
