import { $$getSVG } from "./getSetSVG.js";

export const $$createSVGPoint = ($svg = $$getSVG()) => ({
  x = 0,
  y = 0,
} = {}) => {
  const p = $svg.createSVGPoint();
  p.x = x;
  p.y = y;
  return p;
};
