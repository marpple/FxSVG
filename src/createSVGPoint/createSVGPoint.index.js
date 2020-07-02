import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGPoint = ({ x = 0, y = 0 } = {}) => (
  $svg = $$getSVG()
) => {
  const point = $svg.createSVGPoint();
  point.x = x;
  point.y = y;
  return point;
};
