import { $$createSVGTransform } from "./createSVGTransform.js";
import { $$getSVG } from "./getSetSVG.js";

export const $$createSVGTransformTranslate = ($svg = $$getSVG()) => ({
  tx = 0,
  ty = 0,
} = {}) => {
  const transform = $$createSVGTransform($svg);
  transform.setTranslate(tx, ty);
  return transform;
};
