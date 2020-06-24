import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGPoint = ($svg = $$getSVG()) => ({
  x = 0,
  y = 0,
} = {}) => {
  const p = $svg.createSVGPoint();
  p.x = x;
  p.y = y;
  return p;
};

export const $$createSVGPoint2 = ({ x = 0, y = 0 } = {}) => (
  $svg = $$getSVG()
) => {
  const p = $svg.createSVGPoint();
  p.x = x;
  p.y = y;
  return p;
};

export const $$createSVGPoint3 = ({ x = 0, y = 0 } = {}, $svg = $$getSVG()) => {
  const p = $svg.createSVGPoint();
  p.x = x;
  p.y = y;
  return p;
};
