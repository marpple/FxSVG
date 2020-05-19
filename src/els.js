import { getSVG } from "./getSetSVG.js";

export const els = (svg) => {
  svg = svg.trim();
  const $svg = getSVG();
  $svg.innerHTML = svg;
  const result = [];
  for (const $el of $svg.childNodes) {
    $svg.removeChild($el);
    result.push($el);
  }
  $svg.innerHTML = "";
  return result;
};
