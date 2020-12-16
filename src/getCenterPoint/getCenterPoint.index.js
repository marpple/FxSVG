import { eachL, go, mapL, reduce } from "fxjs/es";
import { $$createSVGPoint } from "../createSVGPoint/createSVGPoint.index.js";
import { $$getBoxPoints } from "../getBoxPoints/getBoxPoints.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

const $$sum = (a, b) => a + b;

const $$calcReduceMean = (nums) => {
  let len = 0;
  const sum = go(
    nums,
    eachL(() => len++),
    reduce($$sum)
  );
  return len ? sum / len : 0;
};

const $$calcCenterPoint = ({
  top_left,
  top_right,
  bottom_left,
  bottom_right,
}) => ($svg = $$getSVG()) => {
  const points = [top_left, top_right, bottom_left, bottom_right];
  const x = $$calcReduceMean(mapL(({ x }) => x, points));
  const y = $$calcReduceMean(mapL(({ y }) => y, points));
  return $$createSVGPoint({ x, y })($svg);
};

export const $$getCenterPoint = ($el, $svg = $$getSVG()) => {
  const { original: _original, transformed: _transformed } = $$getBoxPoints(
    $el,
    $svg
  );
  const [original, transformed] = mapL(
    (points) => $$calcCenterPoint(points)($svg),
    [_original, _transformed]
  );
  return { original, transformed };
};
