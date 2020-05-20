import { $$createSVGPoint } from "./createSVGPoint.js";
import { $$getBaseTransformList } from "./getBaseTransformList.js";
import { $$getSVG } from "./getSetSVG.js";

const $$getOriginalBoxPoints = ($svg = $$getSVG()) => ($el) => {
  const bbox = $el.getBBox();
  return {
    top_left: $$createSVGPoint($svg)({ x: bbox.x, y: bbox.y }),
    top_right: $$createSVGPoint($svg)({ x: bbox.x + bbox.width, y: bbox.y }),
    bottom_left: $$createSVGPoint($svg)({ x: bbox.x, y: bbox.y + bbox.height }),
    bottom_right: $$createSVGPoint($svg)({
      x: bbox.x + bbox.width,
      y: bbox.y + bbox.height,
    }),
  };
};

const $$getTransformedBoxPoints = ($svg = $$getSVG()) => (
  $el,
  original_box_points
) => {
  let tl = $$createSVGPoint($svg)(original_box_points.top_left);
  let tr = $$createSVGPoint($svg)(original_box_points.top_right);
  let bl = $$createSVGPoint($svg)(original_box_points.bottom_left);
  let br = $$createSVGPoint($svg)(original_box_points.bottom_right);

  const consolidated_transform = $$getBaseTransformList($el).consolidate();
  if (consolidated_transform) {
    const { matrix } = consolidated_transform;
    tl = tl.matrixTransform(matrix);
    tr = tr.matrixTransform(matrix);
    bl = bl.matrixTransform(matrix);
    br = br.matrixTransform(matrix);
  }

  return {
    top_left: tl,
    top_right: tr,
    bottom_left: bl,
    bottom_right: br,
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
  const xs = l.map(({ x }) => x);
  const ys = l.map(({ y }) => y);
  const min_x = Math.min(...xs);
  const max_x = Math.max(...xs);
  const min_y = Math.min(...ys);
  const max_y = Math.max(...ys);

  return {
    min: $$createSVGPoint($svg)({ x: min_x, y: min_y }),
    max: $$createSVGPoint($svg)({ x: max_x, y: max_y }),
  };
};

export const $$getBoxPoints = ($svg = $$getSVG()) => ($el) => {
  const original = $$getOriginalBoxPoints($svg)($el);
  const transformed = $$getTransformedBoxPoints($svg)($el, original);
  const bounding = $$getBoundingBoxPoints($svg)($el, transformed);

  return { original, transformed, bounding };
};
