import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformRotate = ({
  angle = 0,
  cx = 0,
  cy = 0,
} = {}) => ($svg = $$getSVG()) => {
  const transform = $$createSVGTransform($svg);
  transform.setRotate(angle, cx, cy);
  return transform;
};
