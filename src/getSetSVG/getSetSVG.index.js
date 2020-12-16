import { isNil } from "fxjs/es";

let svg_el = null;

/**
 * Set the SVGSVGElement used in other functions.
 * The SVGSVGElement will be returned by the $$getSVG function.
 *
 * @param {SVGSVGElement} new_svg_el
 * @return {SVGSVGElement}
 */
export const $$setSVG = (new_svg_el) => {
  svg_el = new_svg_el;
  return svg_el;
};

/**
 * Return the SVGSVGElement set by the $$setSVG function.
 *
 * If there is no SVGSVGElement, the function will create and set a new SVGSVGElement
 * using document.createElementNS method.
 *
 * If there is no global document object or document.createElementNS method,
 * you should call $$setSVG first manually.
 *
 * @return {SVGSVGElement}
 */
export const $$getSVG = () => {
  if (isNil(svg_el)) {
    $$setSVG(document.createElementNS("http://www.w3.org/2000/svg", "svg"));
  }
  return svg_el;
};
