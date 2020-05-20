import { $$createSVGTransform } from "./createSVGTransform.js";
import { $$getSVG } from "./getSetSVG.js";

export const $$createSVGTransformRotate = ($svg = $$getSVG()) => ({
  angle = 0,
  cx = 0,
  cy = 0,
} = {}) => {
  const transform = $$createSVGTransform($svg);
  transform.setRotate(angle, cx, cy);
  return transform;
};
