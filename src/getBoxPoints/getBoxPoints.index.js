import { go, go1, map, mapL, rangeL, reduce } from "fxjs/esm";
import { $$createSVGPoint } from "../createSVGPoint/createSVGPoint.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getSVG } from "../getSetSVG/getSetSVG.index.js";

const $$getOriginalBoxPoints = ($el, $svg = $$getSVG()) => {
  const { x, y, width, height } = $el.getBBox();

  const top_left = $$createSVGPoint({ x, y })($svg);
  const top_right = $$createSVGPoint({ x: x + width, y })($svg);
  const bottom_left = $$createSVGPoint({ x, y: y + height })($svg);
  const bottom_right = $$createSVGPoint({ x: x + width, y: y + height })($svg);

  return { top_left, top_right, bottom_left, bottom_right };
};

const $$getTransformedBoxPoints = ({
  top_left: original_top_left,
  top_right: original_top_right,
  bottom_right: original_bottom_right,
  bottom_left: original_bottom_left,
}) => ($el) => {
  const transform_list = $$getBaseTransformList($el);
  const merged_matrix = go(
    rangeL(transform_list.numberOfItems),
    mapL((i) => transform_list.getItem(i)),
    mapL(({ matrix: m }) => m),
    reduce((m1, m2) => m1.multiply(m2))
  );
  const [top_left, top_right, bottom_left, bottom_right] = mapL(
    (p) => (merged_matrix ? p.matrixTransform(merged_matrix) : p),
    [
      original_top_left,
      original_top_right,
      original_bottom_left,
      original_bottom_right,
    ]
  );

  return {
    top_left,
    top_right,
    bottom_left,
    bottom_right,
  };
};

const $$getBoundingBoxPoints = ({
  top_left: transformed_top_left,
  top_right: transformed_top_right,
  bottom_right: transformed_bottom_right,
  bottom_left: transformed_bottom_left,
}) => ($el, $svg = $$getSVG()) => {
  const points = [
    transformed_top_left,
    transformed_top_right,
    transformed_bottom_left,
    transformed_bottom_right,
  ];
  const [min_x, max_x] = go1(
    map(({ x }) => x, points),
    (xs) => [Math.min(...xs), Math.max(...xs)]
  );
  const [min_y, max_y] = go1(
    map(({ y }) => y, points),
    (ys) => [Math.min(...ys), Math.max(...ys)]
  );
  const min = $$createSVGPoint({ x: min_x, y: min_y })($svg);
  const max = $$createSVGPoint({ x: max_x, y: max_y })($svg);

  return { min, max };
};

export const $$getBoxPoints = ($el, $svg = $$getSVG()) => {
  const original = $$getOriginalBoxPoints($el, $svg);
  const transformed = $$getTransformedBoxPoints(original)($el);
  const bounding = $$getBoundingBoxPoints(transformed)($el, $svg);

  return { original, transformed, bounding };
};
