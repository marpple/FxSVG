import { expect } from "chai";
import {
  appendL,
  defaultTo,
  each,
  equals2,
  flatMapL,
  go,
  isNil,
  isUndefined,
  mapL,
  object,
  rangeL,
  reduce,
  rejectL,
  zipL,
  zipWithIndexL,
} from "fxjs2";
import { deepCopyTransformList } from "../../test/utils/deepCopyTransformList.js";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomBool } from "../../test/utils/makeRandomBool.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
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
  is_need_correction: _is_need_correction,
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
  const is_need_correction = defaultTo(makeRandomBool(), _is_need_correction);
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
        is_need_correction,
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
    is_need_correction,
    merge_type,
    direction,
    transform,
    $el,
    result,
  };
};

export default ({ describe, it }) => [
  describe(`$$controlScaleTransform`, function () {
    it(`The return object has "$el", "controller", "transform" properties.`, function () {
      const { result } = setupMock();

      const keys = new Set(Object.keys(result));

      expect(keys.size).to.equal(3);
      each((k) => expect(keys.has(k)).to.be.true, [
        "$el",
        "controller",
        "transform",
      ]);
    });

    it(`The return element is same with the input element.`, function () {
      const {
        result: { $el: $receive },
        $el: $expect,
      } = setupMock();

      expect($receive).to.equal($expect);
    });

    it(`The return controller object has "update", "end" methods.`, function () {
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

    it(`The return transform object is a scale transform whose sx, sy are the input sx, sy.`, function () {
      const {
        result: { transform: receive_transform },
        sx,
        sy,
      } = setupMock();

      const expect_transform = $$createSVGTransformScale()({ sx, sy });

      expect(receive_transform).deep.equal(expect_transform);
    });

    it(`The return transform object is the transform at the input index + 1.`, function () {
      const {
        result: { transform: receive_transform },
        $el,
        index,
      } = setupMock();
      const expect_transform = $$getBaseTransformList($el).getItem(index + 1);

      expect(receive_transform).to.deep.equal(expect_transform);
    });

    it(`The controller.update method update the return transform with the input sx, sy.`, function () {
      const {
        result: { transform: receive_transform, controller },
      } = setupMock();

      const [sx, sy] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
      controller.update({ sx, sy });

      const expect_transform = $$createSVGTransformScale()({ sx, sy });

      expect(receive_transform).deep.equal(expect_transform);
    });

    it(`The controller.end method merge the transforms from index to index + 2
        to a matrix transform when the merge_type is 1.`, function () {
      const {
        result: { $el, controller },
        index,
        sx,
        sy,
        cx,
        cy,
      } = setupMock({ merge_type: 1 });
      const before_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      controller.end();

      const after_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      go(
        [
          $$createSVGTransformTranslate()({ tx: cx, ty: cy }),
          $$createSVGTransformScale()({ sx, sy }),
          $$createSVGTransformTranslate()({ tx: -cx, ty: -cy }),
        ],
        mapL(({ matrix }) => matrix),
        reduce((m1, m2) => m1.multiply(m2)),
        (matrix) => $$createSVGTransformMatrix()({ matrix }),
        (merged_transform) =>
          go(
            before_transform_list,
            zipWithIndexL,
            rejectL(([i]) => i >= index + 1 && i <= index + 2),
            mapL(([i, transform]) =>
              equals2(i, index) ? merged_transform : transform
            ),
            mapL(({ type, matrix }) => ({ type, matrix }))
          ),
        zipL(after_transform_list),
        each(([receive_transform, expect_transform]) =>
          expect(receive_transform).deep.equal(expect_transform)
        )
      );
    });

    it(`The controller.end method removes the transforms from index to index + 2 when the merge_type is 2.`, function () {
      const {
        result: { $el, controller },
        index,
      } = setupMock({ merge_type: 2 });
      const before_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      controller.end();

      const after_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      go(
        before_transform_list,
        zipWithIndexL,
        rejectL(([i]) => i >= index && i <= index + 2),
        mapL(([, transform]) => transform),
        zipL(after_transform_list),
        each(([receive_transform, expect_transform]) =>
          expect(receive_transform).deep.equal(expect_transform)
        )
      );
    });

    it(`The controller.end method scales the width, height of the element by sx, sy
        when the merge_type is 2.`, function () {
      const {
        result: { $el, controller },
        sx,
        sy,
        width: before_width,
        height: before_height,
      } = setupMock({ merge_type: 2 });

      controller.end();

      const [after_width, after_height] = go(
        ["width", "height"],
        mapL((k) => $el.getAttributeNS(null, k)),
        mapL(parseFloat)
      );

      expect(after_width).equal(before_width * Math.abs(sx));
      expect(after_height).equal(before_height * Math.abs(sy));
    });

    it(`The controller.end method scales the x, y of the element by sx, sy, cx, cy
        when the merge_type is 2.`, function () {
      this.slow(3000);

      // x not change when direction is one of ["n", "s"].
      go(
        ["n", "s"],
        flatMapL((direction) =>
          mapL((is_need_correction) => ({ direction, is_need_correction }), [
            true,
            false,
          ])
        ),
        mapL(({ direction, is_need_correction }) =>
          setupMock({ direction, is_need_correction, merge_type: 2 })
        ),
        each(({ result: { $el, controller }, x: before_x }) => {
          controller.end();

          const after_x = parseFloat($el.getAttributeNS(null, "x"));

          expect(after_x).equal(before_x);
        })
      );

      // y not change when direction is one of ["e", "w"].
      go(
        ["e", "w"],
        flatMapL((direction) =>
          mapL((is_need_correction) => ({ direction, is_need_correction }), [
            true,
            false,
          ])
        ),
        mapL(({ direction, is_need_correction }) =>
          setupMock({ direction, is_need_correction, merge_type: 2 })
        ),
        each(({ result: { $el, controller }, y: before_y }) => {
          controller.end();

          const after_y = parseFloat($el.getAttributeNS(null, "y"));

          expect(after_y).equal(before_y);
        })
      );

      // x is scaled by [(x - cx) * sx + cx]
      // when the direction is one of ["ne", "e", "se", "sw", "w", "nw"]
      // and [sx >= 0 || is_need_correction = false].
      go(
        ["ne", "e", "se", "sw", "w", "nw"],
        flatMapL((direction) =>
          go(
            [true, false],
            mapL((is_need_correction) => ({
              is_need_correction,
              direction,
              sx: makeRandomNumber(),
            })),
            appendL({
              is_need_correction: false,
              direction,
              sx: -makeRandomNumber(1),
            })
          )
        ),
        mapL(({ is_need_correction, direction, sx }) =>
          setupMock({ direction, is_need_correction, sx, merge_type: 2 })
        ),
        each(({ result: { $el, controller }, x: before_x, cx, sx }) => {
          controller.end();

          const after_x = parseFloat($el.getAttributeNS(null, "x"));

          expect(after_x).equal((before_x - cx) * sx + cx);
        })
      );

      // y is scaled by [(y - cy) * sy + cy]
      // when the direction is one of ["n", "ne", "se", "s", "sw", "nw"]
      // and [sy >= 0 || is_need_correction = false].
      go(
        ["n", "ne", "se", "s", "sw", "nw"],
        flatMapL((direction) =>
          go(
            [true, false],
            mapL((is_need_correction) => ({
              is_need_correction,
              direction,
              sy: makeRandomNumber(),
            })),
            appendL({
              is_need_correction: false,
              direction,
              sy: -makeRandomNumber(1),
            })
          )
        ),
        mapL(({ is_need_correction, direction, sy }) =>
          setupMock({ direction, is_need_correction, sy, merge_type: 2 })
        ),
        each(({ result: { $el, controller }, y: before_y, cy, sy }) => {
          controller.end();

          const after_y = parseFloat($el.getAttributeNS(null, "y"));

          expect(after_y).equal((before_y - cy) * sy + cy);
        })
      );

      // x is scaled by [((x - cx) * sx + cx) + (width * sx)]
      // when the direction is one of ["ne", "e", "se", "sw", "w", "nw"]
      // and [sx < 0 && is_need_correction = true].
      go(
        ["ne", "e", "se", "sw", "w", "nw"],
        mapL((direction) => ({ direction, sx: -makeRandomNumber() })),
        mapL(({ direction, sx }) =>
          setupMock({ direction, sx, is_need_correction: true, merge_type: 2 })
        ),
        each(({ result: { $el, controller }, x: before_x, sx, cx, width }) => {
          controller.end();

          const after_x = parseFloat($el.getAttributeNS(null, "x"));

          expect(after_x).equal((before_x - cx) * sx + cx + width * sx);
        })
      );

      // y is scaled by [((y - cy) * sy + cy) + (height * sy)]
      // when the direction is one of ["n", "ne", "se", "s", "sw", "nw"]
      // and [sy < 0 && is_need_correction = true].
      go(
        ["n", "ne", "se", "s", "sw", "nw"],
        mapL((direction) => ({ direction, sy: -makeRandomNumber() })),
        mapL(({ direction, sy }) =>
          setupMock({ direction, sy, is_need_correction: true, merge_type: 2 })
        ),
        each(({ result: { $el, controller }, y: before_y, sy, cy, height }) => {
          controller.end();

          const after_y = parseFloat($el.getAttributeNS(null, "y"));

          expect(after_y).equal((before_y - cy) * sy + cy + height * sy);
        })
      );
    });
  }),
];
