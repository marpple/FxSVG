import { expect } from "chai";
import {
  defaultTo,
  each,
  equals2,
  flatMapL,
  go,
  go1,
  isNil,
  isUndefined,
  map,
  mapL,
  object,
  rangeL,
  reduce,
  rejectL,
  tap,
} from "fxjs2";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomBool } from "../../test/utils/makeRandomBool.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
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

    it(`The controller.end method merge the all transforms of the element.`, function () {
      this.slow(300);

      go(
        [null, makeRandomTransformAttributeValue(1)],
        flatMapL((transform) =>
          mapL((merge_type) => ({ transform, merge_type }), [1, 2])
        ),
        flatMapL((config) =>
          mapL((direction) => ({ ...config, direction }), VALID_DIRECTION)
        ),
        mapL((config) => [
          config,
          !config.transform && equals2(config.merge_type, 2) ? 0 : 1,
        ]),
        each(([{ transform, merge_type, direction }, expect_n]) => {
          const {
            index,
            result: { $el, controller },
          } = setupMock({
            transform,
            merge_type,
            direction,
          });

          const compressed_m = go(
            $el.cloneNode(true),
            $$getBaseTransformList,
            tap((tl) => tl.clear()),
            tap((tl) =>
              go(
                $el,
                $$getBaseTransformList,
                ({ numberOfItems: n }) => n,
                rangeL,
                mapL((i) => {
                  if (i < index || i > index + 2) {
                    return $$getBaseTransformList($el).getItem(i);
                  }

                  if (equals2(merge_type, 1) && equals2(i, index + 1)) {
                    return go(
                      rangeL(3),
                      mapL((i) => index + i),
                      mapL((i) => $$getBaseTransformList($el).getItem(i)),
                      mapL(({ matrix: m }) => m),
                      reduce((m1, m2) => m1.multiply(m2)),
                      (matrix) => ({ matrix }),
                      $$createSVGTransformMatrix()
                    );
                  }

                  return null;
                }),
                rejectL(isNil),
                each((t) => tl.appendItem(t))
              )
            ),
            (tl) => tl.consolidate(),
            (t) => t && t.matrix
          );

          controller.end();

          expect($$getBaseTransformList($el).numberOfItems).to.equal(expect_n);
          expect_n &&
            expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
              compressed_m
            );
        })
      );
    });

    it(`Arbitrary use case test.`, function () {
      this.slow(500);

      go(
        [null, makeRandomTransformAttributeValue(1)],
        flatMapL((transform) =>
          mapL((merge_type) => ({ transform, merge_type }), [1, 2])
        ),
        flatMapL((config) =>
          mapL((direction) => ({ ...config, direction }), VALID_DIRECTION)
        ),
        mapL((config) => [
          config,
          !config.transform && equals2(config.merge_type, 2) ? 0 : 1,
        ]),
        each(([{ transform, merge_type, direction }, expect_n]) => {
          const {
            index,
            cx,
            cy,
            x: x0,
            y: y0,
            width: width0,
            height: height0,
            result: { $el, controller },
          } = setupMock({
            transform,
            merge_type,
            direction,
          });

          const list = go(
            makeRandomInt(),
            rangeL,
            map(() => ({
              sx: makeRandomInt(-100, 100),
              sy: makeRandomInt(-100, 100),
            }))
          );
          each(({ sx, sy }) => controller.update({ sx, sy }), list);

          const { sx, sy } = list[list.length - 1];
          const [x, y] = go(
            [
              [x0, sx, cx, width0, new Set(["ne", "e", "se", "sw", "w", "nw"])],
              [
                y0,
                sy,
                cy,
                height0,
                new Set(["n", "ne", "se", "s", "sw", "nw"]),
              ],
            ],
            mapL(([v, s, c, l, conditions]) =>
              conditions.has(direction)
                ? go1((v - c) * s + c, (v) => (s < 0 ? v + l * s : v))
                : v
            ),
            mapL((v) => `${v}`)
          );
          const [width, height] = go(
            [
              [width0, sx],
              [height0, sy],
            ],
            mapL(([l, s]) => l * Math.abs(s)),
            mapL((v) => `${v}`)
          );
          const compressed_m = go(
            $el.cloneNode(true),
            $$getBaseTransformList,
            tap((tl) => tl.clear()),
            tap((tl) =>
              go(
                $el,
                $$getBaseTransformList,
                ({ numberOfItems: n }) => n,
                rangeL,
                mapL((i) => {
                  if (i < index || i > index + 2) {
                    return $$getBaseTransformList($el).getItem(i);
                  }

                  if (equals2(merge_type, 1) && equals2(i, index + 1)) {
                    return go(
                      rangeL(3),
                      mapL((i) => index + i),
                      mapL((i) => $$getBaseTransformList($el).getItem(i)),
                      mapL(({ matrix: m }) => m),
                      reduce((m1, m2) => m1.multiply(m2)),
                      (matrix) => ({ matrix }),
                      $$createSVGTransformMatrix()
                    );
                  }

                  return null;
                }),
                rejectL(isNil),
                each((t) => tl.appendItem(t))
              )
            ),
            (tl) => tl.consolidate(),
            (t) => t && t.matrix
          );

          controller.end();

          if (merge_type === 2) {
            expect($el.getAttributeNS(null, "x")).to.equal(x);
            expect($el.getAttributeNS(null, "y")).to.equal(y);
            expect($el.getAttributeNS(null, "width")).to.equal(width);
            expect($el.getAttributeNS(null, "height")).to.equal(height);
          }
          expect($$getBaseTransformList($el).numberOfItems).to.equal(expect_n);
          expect_n &&
            expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(
              compressed_m
            );
        })
      );
    });
  }),
];
