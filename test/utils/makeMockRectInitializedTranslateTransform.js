import {
  defaultTo,
  go,
  isNil,
  isUndefined,
  mapL,
  object,
  rangeL,
  rejectL,
} from "fxjs2";
import { $$getBaseTransformList } from "../../src/getBaseTransformList/getBaseTransformList.index.js";
import { $$initTranslateTransform } from "../../src/initTranslateTransform/initTranslateTransform.index.js";
import { makeMockRect } from "./makeMockRect.js";
import { makeRandomInt } from "./makeRandomInt.js";
import { makeRandomNumber } from "./makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "./makeRandomTransformAttributeValue.js";

export const makeMockRectInitializedTranslateTransform = ({
  x: _x,
  y: _y,
  width: _width,
  height: _height,
  tx: _tx,
  ty: _ty,
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
  const index = makeRandomInt(0, transform_list.numberOfItems + 1);
  go(
    rangeL(2),
    mapL(() => makeRandomNumber(-100, 100)),
    ([tx, ty]) => [
      [_tx, tx],
      [_ty, ty],
    ],
    mapL(([a, b]) => defaultTo(b, a)),
    ([tx, ty]) => $$initTranslateTransform()($el, { tx, ty, index })
  );
  const { e: tx, f: ty } = transform_list.getItem(index).matrix;
  const [x, y, width, height] = go(
    ["x", "y", "width", "height"],
    mapL((name) => $el.getAttributeNS(null, name)),
    mapL(parseFloat)
  );

  return { $el, index, tx, ty, x, y, width, height };
};
