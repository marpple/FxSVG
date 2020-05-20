import { $$getSVG } from "./getSetSVG.js";

export const $$els = ($svg = $$getSVG()) => (svg) => {
  svg = svg.trim();
  $svg.innerHTML = svg;
  const result = [...$svg.childNodes];
  $svg.innerHTML = "";
  return result;
};
