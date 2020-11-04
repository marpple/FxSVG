import {
  defaultTo,
  go,
  isNil,
  isUndefined,
  mapL,
  object,
  rangeL,
  rejectL,
} from "fxjs";
import { $$getAttrNS } from "../../src/getAttrNS/getAttrNS.index.js";
import { $$getBaseTransformList } from "../../src/getBaseTransformList/getBaseTransformList.index.js";
import { $$initScaleTransform } from "../../src/initScaleTransform/initScaleTransform.index.js";
import { makeMockRect } from "./makeMockRect.js";
import { makeRandomInt } from "./makeRandomInt.js";
import { makeRandomNumber } from "./makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "./makeRandomTransformAttributeValue.js";

export const makeMockRectInitiatedScaleTransform = ({
  x: _x,
  y: _y,
  width: _width,
  height: _height,
  sx: _sx,
  sy: _sy,
  cx: _cx,
  cy: _cy,
  transform: _transform,
} = {}) => {
  const $el = go(
    [
      ["x", _x],
      ["y", _y],
      ["width", _width],
      ["height", _height],
      [
        "transform",
        isUndefined(_transform)
          ? makeRandomTransformAttributeValue()
          : _transform,
      ],
    ],
    rejectL(([, v]) => isNil(v)),
    object,
    makeMockRect
  );
  const transform_list = $$getBaseTransformList($el);
  const init_index = makeRandomInt(0, transform_list.numberOfItems + 1);
  go(
    rangeL(4),
    mapL(() => makeRandomNumber(-100, 100)),
    ([sx, sy, cx, cy]) => [
      [_sx, sx],
      [_sy, sy],
      [_cx, cx],
      [_cy, cy],
    ],
    mapL(([a, b]) => defaultTo(b, a)),
    ([sx, sy, cx, cy]) =>
      $$initScaleTransform({ sx, sy, cx, cy, index: init_index })($el)
  );
  const index = init_index + 1;
  const [{ e: cx, f: cy }, { a: sx, d: sy }] = go(
    rangeL(2),
    mapL((i) => index - 1 + i),
    mapL((i) => transform_list.getItem(i)),
    mapL(({ matrix: m }) => m)
  );
  const [x, y, width, height] = go(
    ["x", "y", "width", "height"],
    mapL((name) => $$getAttrNS(name)($el)),
    mapL(parseFloat)
  );

  return { $el, index, sx, sy, cx, cy, x, y, width, height };
};
