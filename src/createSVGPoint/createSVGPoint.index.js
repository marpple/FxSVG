import { tap } from "fxjs2";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$createSVGPoint = ({ x = 0, y = 0 } = {}) => (
  $svg = $$getSVG()
) =>
  tap((p) => {
    p.x = x;
    p.y = y;
  })($svg.createSVGPoint());
