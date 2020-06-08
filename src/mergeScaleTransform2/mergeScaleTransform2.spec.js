import { expect } from "chai";
import { defaultTo, each, go, mapL, rangeL, rejectL, takeAll } from "fxjs2";
import {
  deepCopyTransformListToMatrixList,
  makeMockRect,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initScaleTransform } from "../initScaleTransform/initScaleTransform.index.js";
import { $$mergeScaleTransform2 } from "./mergeScaleTransform2.index.js";

const makeMockRectInitiatedScaleTransform = ({
  sx: _sx,
  sy: _sy,
  cx: _cx,
  cy: _cy,
} = {}) => {
  const $el = makeMockRect({ transform: makeRandomTransformAttributeValue() });
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
      $$initScaleTransform()($el, { sx, sy, cx, cy, index: init_index })
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
    mapL((name) => $el.getAttributeNS(null, name)),
    mapL(parseFloat)
  );

  return { $el, index, sx, sy, cx, cy, x, y, width, height };
};

describe(`$$mergeScaleTransform2`, function () {
  describe(`The input values are valid for the function. (Use $$initScaleTransform)`, function () {
    it(`
    The three target "SVGTransform"s will be removed from the SVGTransformList.
    `, function () {
      const { $el, index } = makeMockRectInitiatedScaleTransform();

      const before_list = deepCopyTransformListToMatrixList(
        $$getBaseTransformList($el)
      );

      $$mergeScaleTransform2($el, { index });

      const after_list = deepCopyTransformListToMatrixList(
        $$getBaseTransformList($el)
      );
      expect(
        go(
          rangeL(before_list.length),
          rejectL((i) => i >= index - 1 && i <= index + 1),
          mapL((i) => before_list[i]),
          takeAll
        )
      ).to.deep.equal(after_list);
    });

    it(`The element's width is calculated by [scaled_width = original_width * abs(sx)].`, function () {
      each(
        (direction) => {
          const {
            $el,
            index,
            sx,
            width: before_width,
          } = makeMockRectInitiatedScaleTransform();

          $$mergeScaleTransform2($el, {
            index,
            direction,
            x_name: "x",
            y_name: "y",
            width_name: "width",
            height_name: "height",
          });

          const after_width = parseFloat($el.getAttributeNS(null, "width"));
          expect(after_width, `direction=${direction}`).to.equal(
            before_width * Math.abs(sx)
          );
        },
        ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
      );
    });

    it(`The element's height is calculated by [scaled_height = original_height * abs(sy)].`, function () {
      each(
        (direction) => {
          const {
            $el,
            index,
            sy,
            height: before_height,
          } = makeMockRectInitiatedScaleTransform();

          $$mergeScaleTransform2($el, {
            index,
            direction,
            x_name: "x",
            y_name: "y",
            width_name: "width",
            height_name: "height",
          });

          const after_height = parseFloat($el.getAttributeNS(null, "height"));
          expect(after_height, `direction=${direction}`).to.equal(
            before_height * Math.abs(sy)
          );
        },
        ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
      );
    });

    describe(`The element's x value is calculated by...`, function () {
      describe(`When direction is one of ["n", "s"]...`, function () {
        it(`The scaled x is same with the original x.`, function () {
          each(
            (direction) => {
              const {
                $el,
                index,
                x: before_x,
              } = makeMockRectInitiatedScaleTransform();

              $$mergeScaleTransform2($el, {
                index,
                direction,
                x_name: "x",
                y_name: "y",
                width_name: "width",
                height_name: "height",
              });

              const after_x = parseFloat($el.getAttributeNS(null, "x"));
              expect(after_x).to.equal(before_x);
            },
            ["n", "s"]
          );
        });
      });

      describe(`When direction is one of ["ne", "e", "se", "sw", "w", "nw"]...`, function () {
        it(`The scaled x is [(x - cx) * sx + cx] if [sx >= 0].`, function () {
          each(
            (direction) => {
              const {
                $el,
                index,
                x: before_x,
                cx,
                sx,
              } = makeMockRectInitiatedScaleTransform({
                sx: makeRandomNumber(),
              });

              $$mergeScaleTransform2($el, {
                index,
                direction,
                x_name: "x",
                y_name: "y",
                width_name: "width",
                height_name: "height",
              });

              const after_x = parseFloat($el.getAttributeNS(null, "x"));
              expect(after_x).to.equal((before_x - cx) * sx + cx);
            },
            ["ne", "e", "se", "sw", "w", "nw"]
          );
        });

        it(`The scaled x is [((x - cx) * sx + cx) + width * sx] if [sx < 0].`, function () {
          each(
            (direction) => {
              const {
                $el,
                index,
                x: before_x,
                cx,
                sx,
                width,
              } = makeMockRectInitiatedScaleTransform({
                sx: -makeRandomNumber(),
              });

              $$mergeScaleTransform2($el, {
                index,
                direction,
                x_name: "x",
                y_name: "y",
                width_name: "width",
                height_name: "height",
              });

              const after_x = parseFloat($el.getAttributeNS(null, "x"));
              expect(after_x).to.equal((before_x - cx) * sx + cx + width * sx);
            },
            ["ne", "e", "se", "sw", "w", "nw"]
          );
        });
      });
    });

    describe(`The element's y value is calculated by...`, function () {
      describe(`When direction is one of ["e", "w"]...`, function () {
        it(`The scaled y is same with the original y.`, function () {
          each(
            (direction) => {
              const {
                $el,
                index,
                y: before_y,
              } = makeMockRectInitiatedScaleTransform();

              $$mergeScaleTransform2($el, {
                index,
                direction,
                x_name: "x",
                y_name: "y",
                width_name: "width",
                height_name: "height",
              });

              const after_y = parseFloat($el.getAttributeNS(null, "y"));
              expect(after_y).to.equal(before_y);
            },
            ["e", "w"]
          );
        });
      });

      describe(`When direction is one of ["n", "ne", "se", "s", "sw", "nw"]...`, function () {
        it(`The scaled y is [(y - cy) * sy + cy] if [sy >= 0].`, function () {
          each(
            (direction) => {
              const {
                $el,
                index,
                y: before_y,
                cy,
                sy,
              } = makeMockRectInitiatedScaleTransform({
                sy: makeRandomNumber(),
              });

              $$mergeScaleTransform2($el, {
                index,
                direction,
                x_name: "x",
                y_name: "y",
                width_name: "width",
                height_name: "height",
              });

              const after_y = parseFloat($el.getAttributeNS(null, "y"));
              expect(after_y).to.equal((before_y - cy) * sy + cy);
            },
            ["n", "ne", "se", "s", "sw", "nw"]
          );
        });

        it(`The scaled y is [((y - cy) * sy + cy) + height * sy] if [sy < 0].`, function () {
          each(
            (direction) => {
              const {
                $el,
                index,
                y: before_y,
                cy,
                sy,
                height,
              } = makeMockRectInitiatedScaleTransform({
                sy: -makeRandomNumber(),
              });

              $$mergeScaleTransform2($el, {
                index,
                direction,
                x_name: "x",
                y_name: "y",
                width_name: "width",
                height_name: "height",
              });

              const after_y = parseFloat($el.getAttributeNS(null, "y"));
              expect(after_y).to.equal((before_y - cy) * sy + cy + height * sy);
            },
            ["n", "ne", "se", "s", "sw", "nw"]
          );
        });
      });
    });
  });
});
