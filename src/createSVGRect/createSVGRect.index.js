import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGRect = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
} = {}) => ($svg = $$getSVG()) => {
  const rect = $svg.createSVGRect();
  rect.x = x;
  rect.y = y;
  rect.width = width;
  rect.height = height;
  return rect;
};
