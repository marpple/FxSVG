import { $$createSVGPoint } from "./createSVGPoint.js";
import { $$getBoxPoints } from "./getBoxPoints.js";

const $$calcCenterPoint = (points) => {
  const l = [
    points.top_left,
    points.top_right,
    points.bottom_left,
    points.bottom_right,
  ];
  const x = l.map(({ x }) => x).reduce((a, b) => a + b) / 4;
  const y = l.map(({ y }) => y).reduce((a, b) => a + b) / 4;
  return $$createSVGPoint({ x, y });
};

export const $$getCenterPoint = ($el) => {
  const {
    original: original_points,
    transformed: transformed_points,
  } = $$getBoxPoints($el);

  const original = $$calcCenterPoint(original_points);
  const transformed = $$calcCenterPoint(transformed_points);

  return { original, transformed };
};
