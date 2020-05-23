import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

export const $$els = ($svg = $$getSVG()) => (svg) => {
  svg = svg.trim();
  $svg.innerHTML = svg;
  const result = [...$svg.children];
  $svg.innerHTML = "";
  return result;
};
