import { expect } from "chai";
import {
  appendL,
  defaultTo,
  each,
  equals2,
  flatMapL,
  go,
  isUndefined,
  mapL,
  rangeL,
  reduce,
  rejectL,
  zipL,
  zipWithIndexL,
} from "fxjs2";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import { deepCopyTransformList } from "../../test/utils/deepCopyTransformList.js";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomBool } from "../../test/utils/makeRandomBool.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomNumberExcept } from "../../test/utils/makeRandomNumberExcept.js";
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
  const [sx, sy, cx, cy, x, y] = mapL(
    (a) => defaultTo(makeRandomNumber(-100, 100), a),
    [_sx, _sy, _cx, _cy, _x, _y]
  );
  const [width, height] = mapL(
    (a) => defaultTo(makeRandomNumberExcept(0, 1000, [0]), a),
    [_width, _height]
  );
  const $el = makeMockRect({ x, y, width, height, transform });
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

  return {
    x_name: "x",
    y_name: "y",
    width_name: "width",
    height_name: "height",
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
  };
};

const getAttributesFromElement = (index, $el) => {
  const [x, y, width, height] = go(
    ["x", "y", "width", "height"],
    mapL((k) => $el.getAttributeNS(null, k)),
    mapL(parseFloat)
  );
  const [{ e: cx, f: cy }, { a: sx, d: sy }] = go(
    rangeL(2),
    mapL((i) => index + i),
    mapL((i) => $$getBaseTransformList($el).getItem(i)),
    mapL(({ matrix: m }) => m)
  );
  return { x, y, width, height, cx, cy, sx, sy };
};

export default ({ describe, it }) => [
  describe(`$$controlScaleTransform`, function () {
    it(`The return object has "update", "end" methods.`, function () {
      const {
        x_name,
        y_name,
        width_name,
        height_name,
        cx,
        cy,
        sx,
        sy,
        index,
        is_need_correction,
        merge_type,
        direction,
        $el,
      } = setupMock();

      const controller = $$controlScaleTransform({
        cx,
        cy,
        sx,
        sy,
        index,
        is_need_correction,
        merge_type,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      })($el);

      const entries = new Map(Object.entries(controller));
      expect(entries.size).equal(2);
      each(
        (k) => {
          expect(entries.has(k)).true;
          expect(entries.get(k)).a("function");
        },
        ["update", "end"]
      );
    });

    it(`The function initiates scale transforms to the input element with the input sx, sy, cx, cy, index.`, function () {
      const {
        x_name,
        y_name,
        width_name,
        height_name,
        cx,
        cy,
        sx,
        sy,
        index,
        is_need_correction,
        merge_type,
        direction,
        $el,
      } = setupMock();

      $$controlScaleTransform({
        cx,
        cy,
        sx,
        sy,
        index,
        is_need_correction,
        merge_type,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      })($el);

      const transform_list = $$getBaseTransformList($el);
      const [
        positive_translate_transform,
        scale_transform,
        negative_translate_transform,
      ] = go(
        rangeL(3),
        mapL((i) => index + i),
        mapL((i) => transform_list.getItem(i))
      );
      expectSameValueSVGTransform(
        positive_translate_transform,
        $$createSVGTransformTranslate({ tx: cx, ty: cy })()
      );
      expectSameValueSVGTransform(
        scale_transform,
        $$createSVGTransformScale({ sx, sy })()
      );
      expectSameValueSVGTransform(
        negative_translate_transform,
        $$createSVGTransformTranslate({ tx: -cx, ty: -cy })()
      );
    });

    it(`The controller.update method update the return transform with the input sx, sy.`, function () {
      const {
        x_name,
        y_name,
        width_name,
        height_name,
        cx,
        cy,
        sx,
        sy,
        index,
        is_need_correction,
        merge_type,
        direction,
        $el,
      } = setupMock();
      const controller = $$controlScaleTransform({
        cx,
        cy,
        sx,
        sy,
        index,
        is_need_correction,
        merge_type,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      })($el);
      const [update_sx, update_sy] = mapL(
        () => makeRandomInt(-100, 100),
        rangeL(2)
      );

      controller.update({ sx: update_sx, sy: update_sy });

      const receive_transform = $$getBaseTransformList($el).getItem(index + 1);
      const expect_transform = $$createSVGTransformScale({
        sx: update_sx,
        sy: update_sy,
      })();
      expectSameValueSVGTransform(receive_transform, expect_transform);
    });

    it(`The controller.end method merge the transforms from index to index + 2
        to a matrix transform when the merge_type is 1.`, function () {
      const {
        $el,
        index,
        sx,
        sy,
        cx,
        cy,
        merge_type,
        is_need_correction,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      } = setupMock({
        merge_type: 1,
      });
      const controller = $$controlScaleTransform({
        cx,
        cy,
        sx,
        sy,
        index,
        is_need_correction,
        merge_type,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      })($el);
      const before_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      controller.end();

      const after_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );
      expect(after_transform_list.length).equal(
        before_transform_list.length - 2
      );
      const merged_transform = go(
        [
          $$createSVGTransformTranslate({ tx: cx, ty: cy })(),
          $$createSVGTransformScale({ sx, sy })(),
          $$createSVGTransformTranslate({ tx: -cx, ty: -cy })(),
        ],
        mapL(({ matrix }) => matrix),
        reduce((m1, m2) => m1.multiply(m2)),
        (matrix) => $$createSVGTransformMatrix({ matrix })()
      );
      const pairs = go(
        before_transform_list,
        zipWithIndexL,
        rejectL(([i]) => i >= index + 1 && i <= index + 2),
        mapL(([i, transform]) =>
          equals2(i, index) ? merged_transform : transform
        ),
        zipL(after_transform_list)
      );
      for (const [receive_transform, expect_transform] of pairs) {
        expectSameValueSVGTransform(receive_transform, expect_transform);
      }
    });

    it(`The controller.end method removes the transforms from index to index + 2 when the merge_type is 2.`, function () {
      const {
        $el,
        index,
        sx,
        sy,
        cx,
        cy,
        merge_type,
        is_need_correction,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      } = setupMock({
        merge_type: 2,
      });
      const controller = $$controlScaleTransform({
        cx,
        cy,
        sx,
        sy,
        index,
        is_need_correction,
        merge_type,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      })($el);
      const before_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );

      controller.end();

      const after_transform_list = deepCopyTransformList(
        $$getBaseTransformList($el)
      );
      expect(after_transform_list.length).equal(
        before_transform_list.length - 3
      );
      const pairs = go(
        before_transform_list,
        zipWithIndexL,
        rejectL(([i]) => i >= index && i <= index + 2),
        mapL(([, transform]) => transform),
        zipL(after_transform_list)
      );
      for (const [receive_transform, expect_transform] of pairs) {
        expectSameValueSVGTransform(receive_transform, expect_transform);
      }
    });

    it(`The controller.end method scales the width, height of the element by sx, sy when the merge_type is 2.`, function () {
      const {
        $el,
        index,
        sx: _sx,
        sy: _sy,
        cx,
        cy,
        merge_type,
        is_need_correction,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      } = setupMock({ merge_type: 2 });
      const controller = $$controlScaleTransform({
        cx,
        cy,
        sx: _sx,
        sy: _sy,
        index,
        is_need_correction,
        merge_type,
        x_name,
        y_name,
        width_name,
        height_name,
        direction,
      })($el);
      const {
        width: before_width,
        height: before_height,
        sx,
        sy,
      } = getAttributesFromElement(index, $el);

      controller.end();

      const [after_width, after_height] = go(
        ["width", "height"],
        mapL((k) => $el.getAttributeNS(null, k)),
        mapL(parseFloat)
      );

      expect(after_width).equal(before_width * Math.abs(sx));
      expect(after_height).equal(before_height * Math.abs(sy));
    });

    it(`The controller.end method scales the x, y of the element by sx, sy, cx, cy when the merge_type is 2.`, function () {
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
        each(
          ({
            $el,
            cx,
            cy,
            sx,
            sy,
            index,
            is_need_correction,
            merge_type,
            x_name,
            y_name,
            width_name,
            height_name,
            direction,
          }) => {
            const controller = $$controlScaleTransform({
              cx,
              cy,
              sx,
              sy,
              index,
              is_need_correction,
              merge_type,
              x_name,
              y_name,
              width_name,
              height_name,
              direction,
            })($el);
            const { x: before_x } = getAttributesFromElement(index, $el);

            controller.end();

            const after_x = parseFloat($el.getAttributeNS(null, "x"));
            expect(after_x).equal(before_x);
          }
        )
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
        each(
          ({
            $el,
            cx,
            cy,
            sx,
            sy,
            index,
            is_need_correction,
            merge_type,
            x_name,
            y_name,
            width_name,
            height_name,
            direction,
          }) => {
            const controller = $$controlScaleTransform({
              cx,
              cy,
              sx,
              sy,
              index,
              is_need_correction,
              merge_type,
              x_name,
              y_name,
              width_name,
              height_name,
              direction,
            })($el);
            const { y: before_y } = getAttributesFromElement(index, $el);

            controller.end();

            const after_y = parseFloat($el.getAttributeNS(null, "y"));
            expect(after_y).equal(before_y);
          }
        )
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
              sx: -makeRandomNumberExcept(0, 1000, [0]),
            })
          )
        ),
        mapL(({ is_need_correction, direction, sx }) =>
          setupMock({ direction, is_need_correction, sx, merge_type: 2 })
        ),
        each(
          ({
            $el,
            cx: _cx,
            cy,
            sx: _sx,
            sy,
            index,
            is_need_correction,
            merge_type,
            x_name,
            y_name,
            width_name,
            height_name,
            direction,
          }) => {
            const controller = $$controlScaleTransform({
              cx: _cx,
              cy,
              sx: _sx,
              sy,
              index,
              is_need_correction,
              merge_type,
              x_name,
              y_name,
              width_name,
              height_name,
              direction,
            })($el);
            const { x: before_x, cx, sx } = getAttributesFromElement(
              index,
              $el
            );

            controller.end();

            const after_x = parseFloat($el.getAttributeNS(null, "x"));
            expect(after_x).equal((before_x - cx) * sx + cx);
          }
        )
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
              sy: -makeRandomNumberExcept(0, 1000, [0]),
            })
          )
        ),
        mapL(({ is_need_correction, direction, sy }) =>
          setupMock({ direction, is_need_correction, sy, merge_type: 2 })
        ),
        each(
          ({
            $el,
            cx,
            cy: _cy,
            sx,
            sy: _sy,
            index,
            is_need_correction,
            merge_type,
            x_name,
            y_name,
            width_name,
            height_name,
            direction,
          }) => {
            const controller = $$controlScaleTransform({
              cx,
              cy: _cy,
              sx,
              sy: _sy,
              index,
              is_need_correction,
              merge_type,
              x_name,
              y_name,
              width_name,
              height_name,
              direction,
            })($el);
            const { y: before_y, cy, sy } = getAttributesFromElement(
              index,
              $el
            );

            controller.end();

            const after_y = parseFloat($el.getAttributeNS(null, "y"));
            expect(after_y).equal((before_y - cy) * sy + cy);
          }
        )
      );

      // x is scaled by [((x - cx) * sx + cx) + (width * sx)]
      // when the direction is one of ["ne", "e", "se", "sw", "w", "nw"]
      // and [sx < 0 && is_need_correction = true].
      go(
        ["ne", "e", "se", "sw", "w", "nw"],
        mapL((direction) => ({
          direction,
          sx: -makeRandomNumberExcept(0, 1000, [0]),
        })),
        mapL(({ direction, sx }) =>
          setupMock({ direction, sx, is_need_correction: true, merge_type: 2 })
        ),
        each(
          ({
            $el,
            cx: _cx,
            cy,
            sx: _sx,
            sy,
            index,
            is_need_correction,
            merge_type,
            x_name,
            y_name,
            width_name,
            height_name,
            direction,
          }) => {
            const controller = $$controlScaleTransform({
              cx: _cx,
              cy,
              sx: _sx,
              sy,
              index,
              is_need_correction,
              merge_type,
              x_name,
              y_name,
              width_name,
              height_name,
              direction,
            })($el);
            const { x: before_x, width, sx, cx } = getAttributesFromElement(
              index,
              $el
            );

            controller.end();

            const after_x = parseFloat($el.getAttributeNS(null, "x"));
            expect(after_x).equal((before_x - cx) * sx + cx + width * sx);
          }
        )
      );

      // y is scaled by [((y - cy) * sy + cy) + (height * sy)]
      // when the direction is one of ["n", "ne", "se", "s", "sw", "nw"]
      // and [sy < 0 && is_need_correction = true].
      go(
        ["n", "ne", "se", "s", "sw", "nw"],
        mapL((direction) => ({
          direction,
          sy: -makeRandomNumberExcept(0, 1000, [0]),
        })),
        mapL(({ direction, sy }) =>
          setupMock({ direction, sy, is_need_correction: true, merge_type: 2 })
        ),
        each(
          ({
            $el,
            cx,
            cy: _cy,
            sx,
            sy: _sy,
            index,
            is_need_correction,
            merge_type,
            x_name,
            y_name,
            width_name,
            height_name,
            direction,
          }) => {
            const controller = $$controlScaleTransform({
              cx,
              cy: _cy,
              sx,
              sy: _sy,
              index,
              is_need_correction,
              merge_type,
              x_name,
              y_name,
              width_name,
              height_name,
              direction,
            })($el);
            const { y: before_y, height, cy, sy } = getAttributesFromElement(
              index,
              $el
            );

            controller.end();

            const after_y = parseFloat($el.getAttributeNS(null, "y"));
            expect(after_y).equal((before_y - cy) * sy + cy + height * sy);
          }
        )
      );
    });
  }),
];
