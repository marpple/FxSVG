import { expect } from "chai";
import {
  appendL,
  extend,
  flatMapL,
  go,
  go1,
  head,
  map,
  mapL,
  rangeL,
  rejectL,
  zipL,
  zipWithIndexL,
} from "fxjs2";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
  makeMockRectInitiatedScaleTransform,
} from "../../test/utils/index.js";
import { $$getAttrNS } from "../getAttrNS/getAttrNS.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { makeInvalidCases as makeInvalidIsValidFxSVGTransformListCases } from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.spec.js";
import { $$mergeScaleTransform2 } from "./mergeScaleTransform2.index.js";

const DIRECTIONS = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const expectSameValueTransformList = (
  receive_transform_list,
  expect_transform_list,
  description = "expectSameValueTransformList"
) => {
  expect(receive_transform_list.length).equal(expect_transform_list.length);
  const pairs = zipL(receive_transform_list, expect_transform_list);
  for (const [receive_transform, expect_transform] of pairs) {
    expectSameValueSVGTransform(
      receive_transform,
      expect_transform,
      `expectNotChange(${description})`
    );
  }
};

const expectNotChange = (
  {
    $el: $before,
    transform_list: before_transform_list,
    x: before_x,
    y: before_y,
    width: before_width,
    height: before_height,
  },
  {
    $el: $after,
    transform_list: after_transform_list,
    x: after_x,
    y: after_y,
    width: after_width,
    height: after_height,
  },
  description
) => {
  expect($after, description).equal($before);
  expect(after_x, description).equal(before_x);
  expect(after_y, description).equal(before_y);
  expect(after_width, description).equal(before_width);
  expect(after_height, description).equal(before_height);

  expectSameValueTransformList(
    [...after_transform_list],
    [...before_transform_list]
  );
};

export default ({ describe, it }) => [
  describe(`$$mergeScaleTransform2`, function () {
    it(`The function do nothing but return the input element
        when the input values failed to pass "$$isValidFxScaleSVGTransformList".`, function () {
      this.slow(3000);
      this.timeout(6000);

      const cases = go(
        makeInvalidIsValidFxSVGTransformListCases(),
        flatMapL((o) =>
          mapL((is_need_correction) => extend({ is_need_correction }, o), [
            true,
            false,
          ])
        ),
        flatMapL((o) =>
          mapL((direction) => extend({ direction }, o), DIRECTIONS)
        )
      );
      for (const {
        description,
        $el: $input,
        index,
        is_need_correction,
        direction,
        x: before_x,
        y: before_y,
        width: before_width,
        height: before_height,
      } of cases) {
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeScaleTransform2({
          index,
          is_need_correction,
          direction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($input);

        const [after_x, after_y, after_width, after_height] = go(
          ["x", "y", "width", "height"],
          mapL((k) => $$getAttrNS(k)($output)),
          mapL(parseFloat)
        );
        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        expectNotChange(
          {
            $el: $input,
            transform_list: before_transform_list,
            x: before_x,
            y: before_y,
            width: before_width,
            height: before_height,
          },
          {
            $el: $output,
            transform_list: after_transform_list,
            x: after_x,
            y: after_y,
            width: after_width,
            height: after_height,
          },
          description
        );
      }
    });

    it(`The function do nothing but return the input element
        when the input direction is not in ["n", "ne", "e", "se", "s", "sw", "w", "nw"].`, function () {
      const cases = go1(
        [
          { description: `the direction is null.`, direction: null },
          { description: `the direction is undefined.`, direction: undefined },
          {
            description: `the direction is other string.`,
            direction: go(
              rangeL(2),
              mapL(() =>
                go(
                  rangeL(Infinity),
                  mapL(() => makeRandomInt(97, 123)),
                  mapL((n) => String.fromCharCode(n)),
                  rejectL((s) => new Set(DIRECTIONS).has(s)),
                  head
                )
              ),
              ([a, b]) => (makeRandomBool() ? `${a}${b}` : a)
            ),
          },
          {
            description: `the direction is a number.`,
            direction: makeRandomNumber(-100, 100),
          },
          {
            description: `the direction is a boolean.`,
            direction: makeRandomBool(),
          },
          {
            description: `the direction is a symbol.`,
            direction: Symbol(DIRECTIONS[makeRandomInt(0, 8)]),
          },
        ],
        flatMapL(({ direction, description }) =>
          mapL(
            (is_need_correction) => ({
              is_need_correction,
              direction,
              description,
            }),
            [true, false]
          )
        )
      );
      for (const { direction, description, is_need_correction } of cases) {
        const {
          $el: $input,
          index,
          x: before_x,
          y: before_y,
          width: before_width,
          height: before_height,
        } = makeMockRectInitiatedScaleTransform();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeScaleTransform2({
          index,
          direction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
          is_need_correction,
        })($input);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        const [after_x, after_y, after_width, after_height] = go(
          ["x", "y", "width", "height"],
          mapL((k) => $$getAttrNS(k)($output)),
          mapL(parseFloat)
        );
        expectNotChange(
          {
            $el: $input,
            transform_list: before_transform_list,
            x: before_x,
            y: before_y,
            width: before_width,
            height: before_height,
          },
          {
            $el: $output,
            transform_list: after_transform_list,
            x: after_x,
            y: after_y,
            width: after_width,
            height: after_height,
          },
          description
        );
      }
    });

    it(`The transforms from index - 1 to index + 1 are removed from the transform list.`, function () {
      this.slow(1000);

      const cases = go(
        DIRECTIONS,
        flatMapL((direction) =>
          mapL((is_need_correction) => ({ direction, is_need_correction }), [
            true,
            false,
          ])
        ),
        flatMapL((o) =>
          mapL((transform) => extend(o, { transform }), [
            null,
            makeRandomTransformAttributeValue(1),
          ])
        )
      );
      for (const { direction, is_need_correction, transform } of cases) {
        const { $el, index } = makeMockRectInitiatedScaleTransform({
          transform,
        });
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        $$mergeScaleTransform2({
          index,
          direction,
          is_need_correction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($el);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );
        const expect_transform_list = go(
          before_transform_list,
          zipWithIndexL,
          rejectL(([i]) => i >= index - 1 && i <= index + 1),
          map(([, transform]) => transform)
        );
        expectSameValueTransformList(
          after_transform_list,
          expect_transform_list
        );
      }
    });

    it(`The width, height of the element are scaled by absolute values of sx, sy.`, function () {
      const cases = go(
        DIRECTIONS,
        flatMapL((direction) =>
          mapL((is_need_correction) => ({ is_need_correction, direction }), [
            true,
            false,
          ])
        ),
        flatMapL((o) =>
          mapL((transform) => extend(o, { transform }), [
            null,
            makeRandomTransformAttributeValue(1),
          ])
        )
      );
      for (const { direction, is_need_correction, transform } of cases) {
        const {
          $el,
          index,
          width: before_width,
          height: before_height,
          sx,
          sy,
        } = makeMockRectInitiatedScaleTransform({
          transform,
        });

        $$mergeScaleTransform2({
          index,
          direction,
          is_need_correction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($el);

        const [after_width, after_height] = go(
          ["width", "height"],
          mapL((k) => $$getAttrNS(k)($el)),
          mapL(parseFloat)
        );
        expect(after_width).equal(before_width * Math.abs(sx));
        expect(after_height).equal(before_height * Math.abs(sy));
      }
    });

    it(`The x of the element is same when the direction is one of ["n", "s"].`, function () {
      const cases = go(
        ["n", "s"],
        flatMapL((direction) =>
          mapL((is_need_correction) => ({ is_need_correction, direction }), [
            true,
            false,
          ])
        ),
        flatMapL((o) =>
          mapL((transform) => extend(o, { transform }), [
            null,
            makeRandomTransformAttributeValue(1),
          ])
        )
      );
      for (const { direction, is_need_correction, transform } of cases) {
        const {
          $el,
          index,
          x: before_x,
        } = makeMockRectInitiatedScaleTransform({ transform });

        $$mergeScaleTransform2({
          index,
          direction,
          is_need_correction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($el);

        const after_x = parseFloat($$getAttrNS("x")($el));
        expect(after_x).equal(before_x);
      }
    });

    it(`The y of the element is same when the direction is one of ["e", "w"].`, function () {
      const cases = go(
        ["e", "w"],
        flatMapL((direction) =>
          mapL((is_need_correction) => ({ is_need_correction, direction }), [
            true,
            false,
          ])
        ),
        flatMapL((o) =>
          mapL((transform) => extend(o, { transform }), [
            null,
            makeRandomTransformAttributeValue(1),
          ])
        )
      );
      for (const { direction, is_need_correction, transform } of cases) {
        const {
          $el,
          index,
          y: before_y,
        } = makeMockRectInitiatedScaleTransform({ transform });

        $$mergeScaleTransform2({
          index,
          direction,
          is_need_correction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($el);

        const after_y = parseFloat($$getAttrNS("y")($el));
        expect(after_y).equal(before_y);
      }
    });

    it(`The x of the element is scaled by [(x - cx) * sx + cx]
        when the direction is one of ["ne", "e", "se", "sw", "w", "nw"]
        and [sx >= 0 || is_need_correction = false].`, function () {
      const cases = go(
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
        flatMapL((o) =>
          mapL((transform) => extend(o, { transform }), [
            null,
            makeRandomTransformAttributeValue(1),
          ])
        )
      );
      for (const {
        is_need_correction,
        direction,
        transform,
        sx: _sx,
      } of cases) {
        const {
          $el,
          index,
          x: before_x,
          cx,
          sx,
        } = makeMockRectInitiatedScaleTransform({
          transform,
          sx: _sx,
        });

        $$mergeScaleTransform2({
          index,
          direction,
          is_need_correction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($el);

        const after_x = parseFloat($$getAttrNS("x")($el));
        expect(after_x).equal((before_x - cx) * sx + cx);
      }
    });

    it(`The y of the element is scaled by [(y - cy) * sy + cy]
        when the direction is one of ["n", "ne", "se", "s", "sw", "nw"]
        and [sy >= 0 || is_need_correction = false].`, function () {
      const cases = go(
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
        flatMapL((o) =>
          mapL((transform) => extend(o, { transform }), [
            null,
            makeRandomTransformAttributeValue(1),
          ])
        )
      );
      for (const {
        is_need_correction,
        direction,
        transform,
        sy: _sy,
      } of cases) {
        const {
          $el,
          index,
          y: before_y,
          cy,
          sy,
        } = makeMockRectInitiatedScaleTransform({
          transform,
          sy: _sy,
        });

        $$mergeScaleTransform2({
          index,
          direction,
          is_need_correction,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($el);

        const after_y = parseFloat($$getAttrNS("y")($el));
        expect(after_y).equal((before_y - cy) * sy + cy);
      }
    });

    it(`The x of the element is scaled by [((x - cx) * sx + cx) + (width * sx)]
        when the direction is one of ["ne", "e", "se", "sw", "w", "nw"]
        and [sx < 0 && is_need_correction = true].`, function () {
      const cases = go(
        ["ne", "e", "se", "sw", "w", "nw"],
        mapL((direction) => ({ direction, sx: -makeRandomNumber() })),
        flatMapL((o) =>
          mapL((transform) => extend(o, { transform }), [
            null,
            makeRandomTransformAttributeValue(1),
          ])
        )
      );
      for (const { direction, transform, sx: _sx } of cases) {
        const {
          $el,
          index,
          x: before_x,
          cx,
          sx,
          width,
        } = makeMockRectInitiatedScaleTransform({
          transform,
          sx: _sx,
        });

        $$mergeScaleTransform2({
          index,
          direction,
          is_need_correction: true,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($el);

        const after_x = parseFloat($$getAttrNS("x")($el));
        expect(after_x).equal((before_x - cx) * sx + cx + width * sx);
      }
    });

    it(`The y of the element is scaled by [((y - cy) * sy + cy) + (height * sy)]
        when the direction is one of ["n", "ne", "se", "s", "sw", "nw"]
        and [sy < 0 && is_need_correction = true].`, function () {
      const cases = go(
        ["n", "ne", "se", "s", "sw", "nw"],
        mapL((direction) => ({ direction, sy: -makeRandomNumber() })),
        flatMapL((o) =>
          mapL((transform) => extend(o, { transform }), [
            null,
            makeRandomTransformAttributeValue(1),
          ])
        )
      );
      for (const { direction, transform, sy: _sy } of cases) {
        const {
          $el,
          index,
          y: before_y,
          cy,
          sy,
          height,
        } = makeMockRectInitiatedScaleTransform({
          transform,
          sy: _sy,
        });

        $$mergeScaleTransform2({
          index,
          direction,
          is_need_correction: true,
          x_name: "x",
          y_name: "y",
          width_name: "width",
          height_name: "height",
        })($el);

        const after_y = parseFloat($$getAttrNS("y")($el));
        expect(after_y).equal((before_y - cy) * sy + cy + height * sy);
      }
    });
  }),
];
