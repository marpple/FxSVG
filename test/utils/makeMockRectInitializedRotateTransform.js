import {
  appendL,
  defaultTo,
  go,
  isNil,
  isUndefined,
  mapL,
  object,
  rangeL,
  rejectL,
} from "fxjs2";
import { $$getAttrNS } from "../../src/getAttrNS/getAttrNS.index.js";
import { $$getBaseTransformList } from "../../src/getBaseTransformList/getBaseTransformList.index.js";
import { $$initRotateTransform } from "../../src/initRotateTransform/initRotateTransform.index.js";
import { makeMockRect } from "./makeMockRect.js";
import { makeRandomInt } from "./makeRandomInt.js";
import { makeRandomNumber } from "./makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "./makeRandomTransformAttributeValue.js";

export const makeMockRectInitializedRotateTransform = ({
  x: _x,
  y: _y,
  width: _width,
  height: _height,
  angle: _angle,
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
    rangeL(2),
    mapL(() => makeRandomNumber(-100, 100)),
    ([cx, cy]) => [
      [_cx, cx],
      [_cy, cy],
    ],
    appendL([_angle, makeRandomNumber(-700, 700)]),
    mapL(([a, b]) => defaultTo(b, a)),
    ([cx, cy, angle]) =>
      $$initRotateTransform({ angle, cx, cy, index: init_index })($el)
  );
  const index = init_index + 1;
  const { e: cx, f: cy } = transform_list.getItem(index - 1).matrix;
  const { angle } = transform_list.getItem(index);
  const [x, y, width, height] = go(
    ["x", "y", "width", "height"],
    mapL((name) => $$getAttrNS(name)($el)),
    mapL(parseFloat)
  );

  return { $el, index, angle, cx, cy, x, y, width, height };
};
