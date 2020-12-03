import { each, go, go1, mapL, rangeL, some } from "fxjs/esm";
import { $$getAttrNS } from "../getAttrNS/getAttrNS.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isValidFxScaleSVGTransformList } from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.index.js";
import { $$setAttrNS } from "../setAttrNS/setAttrNS.index.js";

const VALID_DIRECTION = new Set(["n", "ne", "e", "se", "s", "sw", "w", "nw"]);

export const $$mergeScaleTransform2 = ({
  index = 1,
  is_need_correction = true,
  x_name = "x",
  y_name = "y",
  width_name = "width",
  height_name = "height",
  direction,
} = {}) => ($el) => {
  const transform_list = $$getBaseTransformList($el);
  if (
    !$$isValidFxScaleSVGTransformList({ index })(transform_list) ||
    !VALID_DIRECTION.has(direction)
  ) {
    return $el;
  }

  const [{ e: cx2, f: cy2 }, { a: sx, d: sy }, { e: cx1, f: cy1 }] = go(
    rangeL(3),
    mapL((i) => index - 1 + i),
    mapL((i) => transform_list.getItem(i)),
    mapL(({ matrix: m }) => m)
  );
  const [x, y, width, height] = go(
    [x_name, y_name, width_name, height_name],
    mapL((name) => $$getAttrNS(name)($el)),
    mapL(parseFloat)
  );

  go(
    [
      [x, sx, cx1, cx2, width, ["e", "w"]],
      [y, sy, cy1, cy2, height, ["n", "s"]],
    ],
    mapL(([v, s, c1, c2, l, conditions]) =>
      go(
        conditions,
        some((condition) => direction.includes(condition)),
        (is_changed) =>
          is_changed
            ? go1((v + c1) * s + c2, (v) =>
                s < 0 && is_need_correction ? v + l * s : v
              )
            : v
      )
    ),
    ([scaled_x, scaled_y]) => [
      [x_name, scaled_x],
      [y_name, scaled_y],
      [width_name, width * Math.abs(sx)],
      [height_name, height * Math.abs(sy)],
    ],
    mapL(([k, v]) => [k, `${v}`]),
    each((kv) => $$setAttrNS(kv)($el))
  );

  each(() => transform_list.removeItem(index - 1), rangeL(3));

  return $el;
};
