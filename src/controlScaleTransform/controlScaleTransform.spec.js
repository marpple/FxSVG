import { expect } from "chai";
import {
  defaultTo,
  each,
  go,
  isNil,
  isUndefined,
  mapL,
  object,
  rangeL,
  reduce,
  rejectL,
} from "fxjs2";
import { deepCopyTransformListToMatrixList } from "../../test/utils/deepCopyTransformListToMatrixList.js";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomBool } from "../../test/utils/makeRandomBool.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$controlScaleTransform } from "./controlScaleTransform.index.js";

const VALID_DIRECTION = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const setupMock = ({
  x: _x,
  y: _y,
  width: _width,
  height: _height,
  cx: _cx,
  cy: _cy,
  sx: _sx,
  sy: _sy,
  index: _index,
  merge_type: _merge_type,
  direction: _direction,
  transform: _transform,
} = {}) => {
  const transform = isUndefined(_transform)
    ? makeRandomTransformAttributeValue()
    : _transform;
  const $el = go(
    [
      ["x", _x],
      ["y", _y],
      ["width", _width],
      ["height", _height],
      ["transform", transform],
    ],
    rejectL(([, v]) => isNil(v)),
    object,
    makeMockRect
  );
  const index = defaultTo(
    makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1),
    _index
  );
  const merge_type = defaultTo(makeRandomBool() ? 1 : 2, _merge_type);
  const direction = defaultTo(
    VALID_DIRECTION[makeRandomInt(0, VALID_DIRECTION.length)],
    _direction
  );
  const result = go(
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
      $$controlScaleTransform()($el, {
        cx,
        cy,
        sx,
        sy,
        index,
        merge_type,
        x_name: "x",
        y_name: "y",
        width_name: "width",
        height_name: "height",
        direction,
      })
  );
  const [x, y, width, height] = go(
    ["x", "y", "width", "height"],
    mapL((k) => result.$el.getAttributeNS(null, k)),
    mapL(parseFloat)
  );
  const [{ e: cx, f: cy }, { a: sx, d: sy }] = go(
    rangeL(2),
    mapL((i) => index + i),
    mapL((i) => $$getBaseTransformList(result.$el).getItem(i)),
    mapL(({ matrix: m }) => m)
  );
  return {
    x,
    y,
    width,
    height,
    cx,
    cy,
    sx,
    sy,
    index,
    merge_type,
    direction,
    transform,
    $el,
    result,
  };
};

export default ({ describe, it }) => [
  describe(`$$controlScaleTransform`, function () {
    it(`The return object has $el, controller, transform properties.`, function () {
      const { result } = setupMock();

      const keys = new Set(Object.keys(result));

      expect(keys.size).to.equal(3);
      each((k) => expect(keys.has(k)).to.be.true, [
        "$el",
        "controller",
        "transform",
      ]);
    });

    it(`The return $el is same with the input $el.`, function () {
      const {
        result: { $el: $el1 },
        $el: $el2,
      } = setupMock();

      expect($el1).to.equal($el2);
    });

    it(`The return controller object has update, end methods.`, function () {
      const {
        result: { controller },
      } = setupMock();

      const entries = new Map(Object.entries(controller));

      expect(entries.size).to.equal(2);
      each(
        (k) => {
          expect(entries.has(k)).to.be.true;
          expect(entries.get(k)).is.a("function");
        },
        ["update", "end"]
      );
    });

    it(`The return transform object is a scale transform whose angle is the input sx, sy.`, function () {
      const {
        result: { transform },
        sx,
        sy,
      } = setupMock();

      expect($$isScaleSVGTransform(transform)).to.be.true;
      expect(transform.matrix.a).to.equal(sx);
      expect(transform.matrix.d).to.equal(sy);
    });

    it(`The return transform object is the SVGTransform at [index + 1] in SVGTransformList of $el.`, function () {
      const {
        result: { transform: t1 },
        $el,
        index,
      } = setupMock();
      const t2 = $$getBaseTransformList($el).getItem(index + 1);

      expect(t2).to.deep.equal(t1);
    });

    it(`The controller.update method update the return transform with the input sx, sy.`, function () {
      const {
        result: { $el, transform: t1, controller },
        index,
      } = setupMock();
      const t2 = $$getBaseTransformList($el).getItem(index + 1);

      const [sx, sy] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
      controller.update({ sx, sy });

      expect(t1.matrix.a).to.equal(sx);
      expect(t1.matrix.d).to.equal(sy);
      expect(t1).to.deep.equal(t2);
    });

    describe(`The controller.end method merge the all transforms of the element.`, function () {
      describe(`When no other transforms...`, function () {
        it(`When merge_type = 1...`, function () {
          each((direction) => {
            const {
              result: { $el, controller },
            } = setupMock({
              transform: null,
              merge_type: 1,
              direction,
            });

            const compressed_m = go(
              $el,
              $$getBaseTransformList,
              deepCopyTransformListToMatrixList,
              reduce((m1, m2) => m1.multiply(m2))
            );

            controller.end();

            expect($$getBaseTransformList($el).numberOfItems).to.equal(1);
            expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
              compressed_m
            );
          }, VALID_DIRECTION);
        });

        it(`When merge_type = 2...`, function () {
          each((direction) => {
            const {
              result: { $el, controller },
            } = setupMock({
              transform: null,
              merge_type: 2,
              direction,
            });

            controller.end();

            expect($$getBaseTransformList($el).numberOfItems).to.equal(0);
          }, VALID_DIRECTION);
        });
      });
    });

    describe(``, function () {});
  }),
];
