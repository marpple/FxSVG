import { $$getSVG } from "./getSetSVG.js";

export const $$els = (svg) => {
  svg = svg.trim();
  const $svg = $$getSVG();
  $svg.innerHTML = svg;
  const result = [...$svg.childNodes];
  $svg.innerHTML = "";
  return result;
};
