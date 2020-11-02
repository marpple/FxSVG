import chai from "chai";
import { go, mapL, reduce } from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  makeMockRect,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$consolidateTransformList } from "./consolidateTransformList.index.js";

const { expect } = chai;

const setupMock = ({ transform = makeRandomTransformAttributeValue() } = {}) =>
  $$getBaseTransformList(makeMockRect({ transform }));

export default ({ describe, it }) => [
  describe(`$$consolidateTransformList`, function () {
    it(`The return transform list is the same reference with the input transform list.`, function () {
      const input_list = setupMock();

      const output_list = $$consolidateTransformList(input_list);

      expect(output_list).equal(input_list);
    });

    it(`The return transform list has 0 or 1 transform.`, function () {
      const transform_cases = [
        [null, 0],
        [makeRandomTransformAttributeValue(1), 1],
      ];
      for (const [transform, n] of transform_cases) {
        const input_list = setupMock({ transform });

        const output_list = $$consolidateTransformList(input_list);

        expect(output_list.numberOfItems).equal(n);
      }
    });

    it(`The consolidated transform's matrix is same with the matrix from multiplying all transform's matrix.`, function () {
      const input_list = setupMock({
        transform: makeRandomTransformAttributeValue(1, 10),
      });
      const matrix = go(
        input_list,
        mapL(({ matrix: m }) => m),
        reduce((m1, m2) => m1.multiply(m2))
      );

      const output_list = $$consolidateTransformList(input_list);

      expectSameValueSVGMatrix(output_list.getItem(0).matrix, matrix);
    });
  }),
];
