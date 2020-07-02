import { expect } from "chai";
import { map, reduce } from "fxjs2";
import { makeMockRect } from "../../test/utils/makeMockRect.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$getBoxPoints } from "./getBoxPoints.index.js";

const setupMock = ({ transform } = {}) => {
  const x = makeRandomInt(-1000, 1000);
  const y = makeRandomInt(-1000, 1000);
  const width = makeRandomInt(1, 1000);
  const height = makeRandomInt(1, 1000);

  const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  const $el = makeMockRect({
    x: `${x}`,
    y: `${y}`,
    width: `${width}`,
    height: `${height}`,
    transform,
  });

  document.body.appendChild($svg);
  $svg.appendChild($el);

  return { x, y, width, height, $el, $svg };
};

const clearMock = ({ $svg }) => {
  document.body.removeChild($svg);
};

export default ({ describe, it }) => [
  describe(`$$getBoxPoints`, function () {
    it(`The return "original" values are calculated from the initial input element position.`, function () {
      const transform = makeRandomTransformAttributeValue(1, 10, () =>
        makeRandomNumber(-700, 700)
      );
      const cases = [setupMock(), setupMock({ transform })];
      for (const { $el, $svg, x, y, width, height } of cases) {
        const {
          original: { top_left, top_right, bottom_right, bottom_left },
        } = $$getBoxPoints($el);

        expect(top_left.x).to.equal(x);
        expect(top_left.y).to.equal(y);

        expect(top_right.x).to.equal(x + width);
        expect(top_right.y).to.equal(y);

        expect(bottom_right.x).to.equal(x + width);
        expect(bottom_right.y).to.equal(y + height);

        expect(bottom_left.x).to.equal(x);
        expect(bottom_left.y).to.equal(y + height);

        clearMock({ $svg });
      }
    });

    it(`The return "transformed" values are calculated from the transformed input element's position.`, function () {
      const transform = makeRandomTransformAttributeValue(1, 10, () =>
        makeRandomNumber(-700, 700)
      );
      const cases = [setupMock(), setupMock({ transform })];
      for (const { $el, $svg } of cases) {
        const transform_list = $$getBaseTransformList($el);

        const {
          original: { top_left, top_right, bottom_right, bottom_left },
          transformed: {
            top_left: { x: x1_1, y: y1_1 },
            top_right: { x: x2_1, y: y2_1 },
            bottom_right: { x: x3_1, y: y3_1 },
            bottom_left: { x: x4_1, y: y4_1 },
          },
        } = $$getBoxPoints($el);
        const [
          { x: x1_2, y: y1_2 },
          { x: x2_2, y: y2_2 },
          { x: x3_2, y: y3_2 },
          { x: x4_2, y: y4_2 },
        ] = reduce(
          (points, { matrix }) =>
            map((point) => point.matrixTransform(matrix), points),
          [top_left, top_right, bottom_right, bottom_left],
          transform_list
        );

        expect(x1_2).equal(x1_1);
        expect(y1_2).equal(y1_1);
        expect(x2_2).equal(x2_1);
        expect(y2_2).equal(y2_1);
        expect(x3_2).equal(x3_1);
        expect(y3_2).equal(y3_1);
        expect(x4_2).equal(x4_1);
        expect(y4_2).equal(y4_1);

        clearMock({ $svg });
      }
    });

    it(`The return "bounding" values are calculated
        from the minimum and maximum values of the return "transformed" values.`, function () {
      const transform = makeRandomTransformAttributeValue(1, 10, () =>
        makeRandomNumber(-700, 700)
      );
      const cases = [setupMock(), setupMock({ transform })];
      for (const { $el, $svg } of cases) {
        const {
          transformed: {
            top_left: { x: x1, y: y1 },
            top_right: { x: x2, y: y2 },
            bottom_right: { x: x3, y: y3 },
            bottom_left: { x: x4, y: y4 },
          },
          bounding: {
            min: { x: min_x_1, y: min_y_1 },
            max: { x: max_x_1, y: max_y_1 },
          },
        } = $$getBoxPoints($el);

        const min_x_2 = Math.min(x1, x2, x3, x4);
        const min_y_2 = Math.min(y1, y2, y3, y4);
        const max_x_2 = Math.max(x1, x2, x3, x4);
        const max_y_2 = Math.max(y1, y2, y3, y4);

        expect(min_x_1).equal(min_x_2);
        expect(min_y_1).equal(min_y_2);
        expect(max_x_1).equal(max_x_2);
        expect(max_y_1).equal(max_y_2);

        clearMock({ $svg });
      }
    });
  }),
];
