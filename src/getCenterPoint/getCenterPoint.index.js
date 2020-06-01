import { go, mapL, reduce } from "fxjs2";
import { $$createSVGPoint } from "../createSVGPoint/createSVGPoint.index.js";
import { $$getBoxPoints } from "../getBoxPoints/getBoxPoints.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

const $$calcCenterPoint = ($svg = $$getSVG()) => (points) => {
  const l = [
    points.top_left,
    points.top_right,
    points.bottom_left,
    points.bottom_right,
  ];
  const x = go(
    l,
    mapL(({ x }) => x),
    reduce((a, b) => a + b),
    (n) => n / 4
  );
  const y = go(
    l,
    mapL(({ y }) => y),
    reduce((a, b) => a + b),
    (n) => n / 4
  );
  return $$createSVGPoint($svg)({ x, y });
};

export const $$getCenterPoint = ($svg = $$getSVG()) => ($el) =>
  go(
    $$getBoxPoints($svg)($el),
    ({ original, transformed }) => [original, transformed],
    mapL($$calcCenterPoint($svg)),
    ([original, transformed]) => ({ original, transformed })
  );
