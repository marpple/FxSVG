import { $$createSVGPoint } from "./createSVGPoint.js";
import { $$getBoxPoints } from "./getBoxPoints.js";
import { $$getSVG } from "./getSetSVG.js";

const $$calcCenterPoint = ($svg = $$getSVG()) => (points) => {
  const l = [
    points.top_left,
    points.top_right,
    points.bottom_left,
    points.bottom_right,
  ];
  const x = l.map(({ x }) => x).reduce((a, b) => a + b) / 4;
  const y = l.map(({ y }) => y).reduce((a, b) => a + b) / 4;
  return $$createSVGPoint($svg)({ x, y });
};

export const $$getCenterPoint = ($svg = $$getSVG()) => ($el) => {
  const {
    original: original_points,
    transformed: transformed_points,
  } = $$getBoxPoints($svg)($el);

  const original = $$calcCenterPoint($svg)(original_points);
  const transformed = $$calcCenterPoint($svg)(transformed_points);

  return { original, transformed };
};
