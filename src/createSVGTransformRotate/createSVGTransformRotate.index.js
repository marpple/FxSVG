import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGTransformRotate = ($svg = $$getSVG()) => ({
  angle = 0,
  cx = 0,
  cy = 0,
} = {}) => {
  const transform = $$createSVGTransform($svg);
  transform.setRotate(angle, cx, cy);
  return transform;
};

export const $$createSVGTransformRotate2 = ({
  angle = 0,
  cx = 0,
  cy = 0,
} = {}) => ($svg = $$getSVG()) => {
  const transform = $$createSVGTransform($svg);
  transform.setRotate(angle, cx, cy);
  return transform;
};

export const $$createSVGTransformRotate3 = (
  { angle = 0, cx = 0, cy = 0 } = {},
  $svg = $$getSVG()
) => {
  const transform = $$createSVGTransform($svg);
  transform.setRotate(angle, cx, cy);
  return transform;
};
