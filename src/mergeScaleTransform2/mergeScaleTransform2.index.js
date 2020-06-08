import { each, go, mapL, rangeL } from "fxjs2";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isValidFxScaleSVGTransformList } from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.index.js";

export const $$mergeScaleTransform2 = (
  $el,
  { index, x_name, y_name, width_name, height_name, direction }
) => {
  const transform_list = $$getBaseTransformList($el);

  if (!$$isValidFxScaleSVGTransformList(transform_list, { index })) {
    return $el;
  }

  const [{ e: cx2, f: cy2 }, { a: sx, d: sy }, { e: cx1, f: cy1 }] = go(
    rangeL(3),
    mapL((i) => index - 1 + i),
    mapL((i) => transform_list.getItem(i)),
    mapL(({ matrix: m }) => m)
  );
  const [x, y, width, height] = mapL(
    (name) => parseFloat($el.getAttributeNS(null, name)),
    [x_name, y_name, width_name, height_name]
  );

  const [scaled_width, scaled_height] = mapL(([len, s]) => len * Math.abs(s), [
    [width, sx],
    [height, sy],
  ]);
  let scaled_x = x;
  let scaled_y = y;
  if (direction === "n") {
    scaled_y = sy >= 0 ? (scaled_y + cy1) * sy + cy2 : scaled_y + height;
  } else if (direction === "ne") {
    scaled_x = sx >= 0 ? (scaled_x + cx1) * sx + cx2 : scaled_x - scaled_width;
    scaled_y = sy >= 0 ? (scaled_y + cy1) * sy + cy2 : scaled_y + height;
  } else if (direction === "e") {
    scaled_x = sx >= 0 ? (scaled_x + cx1) * sx + cx2 : scaled_x - scaled_width;
  } else if (direction === "se") {
    scaled_x = sx >= 0 ? (scaled_x + cx1) * sx + cx2 : scaled_x - scaled_width;
    scaled_y = sy >= 0 ? (scaled_y + cy1) * sy + cy2 : scaled_y - scaled_height;
  } else if (direction === "s") {
    scaled_y = sy >= 0 ? (scaled_y + cy1) * sy + cy2 : scaled_y - scaled_height;
  } else if (direction === "sw") {
    scaled_x = sx >= 0 ? (scaled_x + cx1) * sx + cx2 : scaled_x + width;
    scaled_y = sy >= 0 ? (scaled_y + cy1) * sy + cy2 : scaled_y - scaled_height;
  } else if (direction === "w") {
    scaled_x = sx >= 0 ? (scaled_x + cx1) * sx + cx2 : scaled_x + width;
  } else if (direction === "nw") {
    scaled_x = sx >= 0 ? (scaled_x + cx1) * sx + cx2 : scaled_x + width;
    scaled_y = sy >= 0 ? (scaled_y + cy1) * sy + cy2 : scaled_y + height;
  }

  go(
    [
      [x_name, scaled_x],
      [y_name, scaled_y],
      [width_name, scaled_width],
      [height_name, scaled_height],
    ],
    mapL(([k, v]) => [k, `${v}`]),
    each(([k, v]) => $el.setAttributeNS(null, k, v))
  );

  each(() => transform_list.removeItem(index - 1), rangeL(3));

  return $el;
};
