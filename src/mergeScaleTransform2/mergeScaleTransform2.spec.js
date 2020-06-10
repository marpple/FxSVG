import { expect } from "chai";
import {
  each,
  flatMapL,
  go,
  head,
  isNil,
  join,
  mapL,
  rangeL,
  rejectL,
  takeAll,
} from "fxjs2";
import {
  deepCopyTransformListToMatrixList,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumber,
} from "../../test/utils/index.js";
import { makeMockRectInitiatedScaleTransform } from "../../test/utils/makeMockRectInitializedScaleTransform.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import {
  makeInvalidIndexCases,
  makeInvalidSVGMatrixValueCases,
  makeInvalidSVGTransformTypeCases,
} from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.spec.js";
import { $$mergeScaleTransform2 } from "./mergeScaleTransform2.index.js";

const DIRECTIONS = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

const expectSameElementAndSameTransformListAfterMerge = ($el, config) => {
  const before_list = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );
  const result = $$mergeScaleTransform2($el, config);
  const after_list = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );
  expect(result).to.equal($el);
  expect(after_list).to.deep.equal(before_list);
};

const runInvalidTestCases = (it, makeInvalidCases) =>
  go(
    DIRECTIONS,
    flatMapL((direction) =>
      mapL(
        ([title, $el, index]) => [
          `If [[${title}] + [direction=${direction}]]...`,
          $el,
          index,
          direction,
        ],
        makeInvalidCases()
      )
    ),
    each(([title, $el, index, direction]) =>
      it(title, function () {
        expectSameElementAndSameTransformListAfterMerge($el, {
          index,
          direction,
        });
      })
    )
  );

export default ({ describe, it }) => [
  describe(`$$mergeScaleTransform2`, function () {
    describe(`The input values are valid for the function. (Use $$initScaleTransform)`, function () {
      it(`
    The three target "SVGTransform"s will be removed from the SVGTransformList.
    `, function () {
        each(
          (direction) => {
            const { $el, index } = makeMockRectInitiatedScaleTransform();

            const before_list = deepCopyTransformListToMatrixList(
              $$getBaseTransformList($el)
            );

            $$mergeScaleTransform2($el, { index, direction });

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
          },
          ["n", "ne", "e", "se", "s", "sw", "w", "nw"]
        );
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
                expect(after_x).to.equal(
                  (before_x - cx) * sx + cx + width * sx
                );
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
                expect(after_y).to.equal(
                  (before_y - cy) * sy + cy + height * sy
                );
              },
              ["n", "ne", "se", "s", "sw", "nw"]
            );
          });
        });
      });
    });

    describe(`
    If the input values are invalid for the function, the function do nothing but return the input element.
    `, function () {
      describe(`When the input direction is not in ["n", "ne", "e", "se", "s", "sw", "w", "nw"]...`, function () {
        each(
          ([title, direction]) =>
            it(title, function () {
              const {
                $el,
                index,
                x: before_x,
                y: before_y,
                width: before_width,
                height: before_height,
              } = makeMockRectInitiatedScaleTransform();
              const before_list = deepCopyTransformListToMatrixList(
                $$getBaseTransformList($el)
              );

              $$mergeScaleTransform2($el, { index, direction });

              const after_list = deepCopyTransformListToMatrixList(
                $$getBaseTransformList($el)
              );
              const [after_x, after_y, after_width, after_height] = go(
                ["x", "y", "width", "height"],
                mapL((name) => $el.getAttributeNS(null, name)),
                mapL(parseFloat)
              );
              expect(after_list).to.deep.equal(before_list);
              expect(after_x).to.equal(before_x);
              expect(after_y).to.equal(before_y);
              expect(after_width).to.equal(before_width);
              expect(after_height).to.equal(before_height);
            }),
          [
            [`If the direction is null...`, null],
            [`If the direction is undefined...`, undefined],
            [
              `If the direction is other string...`,
              go(
                rangeL(2),
                mapL(() =>
                  go(
                    rangeL(Infinity),
                    mapL(() => makeRandomInt(97, 123)),
                    mapL((n) => String.fromCharCode(n)),
                    rejectL((s) =>
                      new Set(["n", "ne", "e", "se", "s", "sw", "w", "nw"]).has(
                        s
                      )
                    ),
                    head
                  )
                ),
                ([a, b]) => [a, makeRandomBool() ? b : null],
                rejectL(isNil),
                join("")
              ),
            ],
            [`If the direction is a number...`, makeRandomNumber(-100, 100)],
            [`If the direction is a boolean...`, makeRandomBool()],
            [
              `If the direction is a symbol...`,
              go(
                ["n", "ne", "e", "se", "s", "sw", "w", "nw"],
                (list) => list[makeRandomInt(0, 8)],
                (s) => Symbol(s)
              ),
            ],
          ]
        );
      });

      describe(`When the input element's SVGTransformList and the input index is not pass $$isValidFxScaleSVGTransformList...`, function () {
        describe(`The input index should [0 < index < SVGTransformList.numberOfItems - 1].`, function () {
          runInvalidTestCases(it, makeInvalidIndexCases);
        });

        describe(`The SVGTransform should be a valid type.`, function () {
          runInvalidTestCases(it, makeInvalidSVGTransformTypeCases);
        });

        describe(`The SVGMatrix values should be valid.`, function () {
          runInvalidTestCases(it, makeInvalidSVGMatrixValueCases);
        });
      });
    });
  }),
];
