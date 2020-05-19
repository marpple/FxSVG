import { $$getSVG } from "./getSetSVG.js";

export const $$createSVGPoint = ({ x = 0, y = 0 } = {}) => {
  const p = $$getSVG().createSVGPoint();
  p.x = x;
  p.y = y;
  return p;
};
