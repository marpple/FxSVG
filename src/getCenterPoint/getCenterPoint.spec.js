import { expect } from "chai";
import { go, mapL, reduce } from "fxjs2";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$createSVGPoint } from "../createSVGPoint/createSVGPoint.index.js";
import { $$getBoxPoints } from "../getBoxPoints/getBoxPoints.index.js";
import { $$getCenterPoint } from "./getCenterPoint.index.js";

const setupMock = ({ transform } = {}) => {
  const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const $el = makeMockRect({
    x: `${makeRandomInt(-1000, 1000)}`,
    y: `${makeRandomInt(-1000, 1000)}`,
    width: `${makeRandomInt(1, 1000)}`,
    height: `${makeRandomInt(1, 1000)}`,
    transform,
  });

  document.body.appendChild($svg);
  $svg.appendChild($el);

  return { $el, $svg };
};

const clearMock = ({ $svg }) => {
  document.body.removeChild($svg);
};

export default ({ describe, it }) => [
  describe(`$$getCenterPoint`, function () {
    it(`The return "original", "transformed" values are centers
        of the return "original", "transformed" values from "$$getBoxPoints()".`, function () {
      const cases = [
        setupMock(),
        setupMock({
          transform: makeRandomTransformAttributeValue(1, 10, () =>
            makeRandomNumber(-700, 700)
          ),
        }),
      ];
      for (const { $el, $svg } of cases) {
        const [
          { x: expect_original_x, y: expect_original_y },
          { x: expect_transformed_x, y: expect_transformed_y },
        ] = go(
          $$getBoxPoints($el),
          ({ original, transformed }) =>
            mapL(
              ({ top_left, top_right, bottom_right, bottom_left }) => [
                top_left,
                top_right,
                bottom_right,
                bottom_left,
              ],
              [original, transformed]
            ),
          mapL(
            reduce(({ x: x1, y: y1 }, { x: x2, y: y2 }) => ({
              x: x1 + x2,
              y: y1 + y2,
            }))
          ),
          mapL(({ x, y }) => $$createSVGPoint({ x: x / 4, y: y / 4 })())
        );
        const {
          original: { x: receive_original_x, y: receive_original_y },
          transformed: { x: receive_transformed_x, y: receive_transformed_y },
        } = $$getCenterPoint($el);

        expect(receive_original_x, "invalid_original_x").equal(
          expect_original_x
        );
        expect(receive_original_y, "invalid_original_y").equal(
          expect_original_y
        );
        expect(receive_transformed_x, "invalid_transformed_x").equal(
          expect_transformed_x
        );
        expect(receive_transformed_y, "invalid_transformed_y").equal(
          expect_transformed_y
        );

        clearMock({ $svg });
      }
    });
  }),
];
