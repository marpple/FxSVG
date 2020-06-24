import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformScale = ($svg = $$getSVG()) => ({
  sx = 1,
  sy = 1,
} = {}) => {
  const transform = $$createSVGTransform($svg);
  transform.setScale(sx, sy);
  return transform;
};

export const $$createSVGTransformScale2 = ({ sx = 1, sy = 1 } = {}) => (
  $svg = $$getSVG()
) => {
  const transform = $$createSVGTransform($svg);
  transform.setScale(sx, sy);
  return transform;
};

export const $$createSVGTransformScale3 = (
  { sx = 1, sy = 1 } = {},
  $svg = $$getSVG()
) => {
  const transform = $$createSVGTransform($svg);
  transform.setScale(sx, sy);
  return transform;
};
