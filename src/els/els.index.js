import { each } from "fxjs2";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$els = ($svg = $$getSVG()) => (svg) => {
  svg = svg.trim();
  $svg.innerHTML = svg;
  const result = each(($el) => $svg.removeChild($el), [...$svg.children]);
  $svg.innerHTML = "";
  return result;
};
