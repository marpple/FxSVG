import { go, map, mapL } from "fxjs2";
import { $$createSVGPoint } from "../createSVGPoint/createSVGPoint.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

const $$getOriginalBoxPoints = ($svg = $$getSVG()) => ($el) => {
  const bbox = $el.getBBox();
  const [top_left, top_right, bottom_left, bottom_right] = mapL(
    $$createSVGPoint($svg),
    [
      { x: bbox.x, y: bbox.y },
      { x: bbox.x + bbox.width, y: bbox.y },
      { x: bbox.x, y: bbox.y + bbox.height },
      {
        x: bbox.x + bbox.width,
        y: bbox.y + bbox.height,
      },
    ]
  );

  return {
    top_left,
    top_right,
    bottom_left,
    bottom_right,
  };
};

const $$getTransformedBoxPoints = ($svg = $$getSVG()) => (
  $el,
  original_box_points
) => {
  const t = $$getBaseTransformList($el).consolidate();
  const [top_left, top_right, bottom_left, bottom_right] = go(
    [
      original_box_points.top_left,
      original_box_points.top_right,
      original_box_points.bottom_left,
      original_box_points.bottom_right,
    ],
    mapL($$createSVGPoint($svg)),
    mapL((p) => (t ? p.matrixTransform(t.matrix) : p))
  );

  return {
    top_left,
    top_right,
    bottom_left,
    bottom_right,
  };
};

const $$getBoundingBoxPoints = ($svg = $$getSVG()) => (
  $el,
  transformed_box_points
) => {
  const l = [
    transformed_box_points.top_left,
    transformed_box_points.top_right,
    transformed_box_points.bottom_left,
    transformed_box_points.bottom_right,
  ];
  const [min_x, max_x] = go(
    l,
    map(({ x }) => x),
    (xs) => [Math.min(...xs), Math.max(...xs)]
  );
  const [min_y, max_y] = go(
    l,
    map(({ y }) => y),
    (ys) => [Math.min(...ys), Math.max(...ys)]
  );
  const [min, max] = mapL($$createSVGPoint($svg), [
    { x: min_x, y: min_y },
    { x: max_x, y: max_y },
  ]);

  return {
    min,
    max,
  };
};

export const $$getBoxPoints = ($svg = $$getSVG()) => ($el) => {
  const original = $$getOriginalBoxPoints($svg)($el);
  const transformed = $$getTransformedBoxPoints($svg)($el, original);
  const bounding = $$getBoundingBoxPoints($svg)($el, transformed);

  return { original, transformed, bounding };
};
