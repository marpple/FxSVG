import { expect } from "chai";
import { equals2, go, mapL, rejectL, zipL, zipWithIndexL } from "fxjs2";
import {
  expectSameValueSVGMatrix,
  expectSameValueSVGTransform,
} from "../../test/assertions/index.js";
import {
  makeRandomSVGMatrix,
  makeRandomNumber,
  makeRandomInt,
  deepCopyTransformList,
  makeRandomTransformAttributeValue,
  makeMockRect,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initMatrixTransform } from "./initMatrixTransform.index.js";

const setupSVGList = () => [
  undefined,
  document.createElementNS("http://www.w3.org/2000/svg", "svg"),
];

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

export default ({ describe, it }) => [
  describe(`$$initMatrixTransform`, function () {
    it(`The length of the SVG transform list is increased by 1.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));
        const { numberOfItems: before_length } = $$getBaseTransformList($el);

        $$initMatrixTransform({ matrix, index })($el, $svg);

        const { numberOfItems: after_length } = $$getBaseTransformList($el);
        expect(after_length).equal(before_length + 1);
      }
    });

    it(`The transform at input index is a matrix transform with the input matrix.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));

        $$initMatrixTransform({ matrix, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index);
        expectSameValueSVGMatrix(transform.matrix, matrix);
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        $$initMatrixTransform({ matrix, index })($el, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );
        expect(after_transform_list.length).equal(
          before_transform_list.length + 1
        );
        const pairs = go(
          after_transform_list,
          zipWithIndexL,
          rejectL(([i]) => equals2(index, i)),
          mapL(([, transform]) => transform),
          zipL(before_transform_list)
        );
        for (const [before_transform, after_transform] of pairs) {
          expectSameValueSVGTransform(after_transform, before_transform);
        }
      }
    });

    it(`The transform at input index is an identity matrix when there is no input matrix.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        $$initMatrixTransform({ index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index);
        const identity_matrix = $$createSVGMatrix()();
        expectSameValueSVGMatrix(transform.matrix, identity_matrix);
      }
    });

    it(`The transform is at index 0 when there is no input index.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));

        $$initMatrixTransform({ matrix })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(0);
        expectSameValueSVGMatrix(transform.matrix, matrix);
      }
    });

    it(`The transform at index 0 is an identity matrix when there is no input object.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        $$initMatrixTransform()($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(0);
        const identity_matrix = $$createSVGMatrix()();
        expectSameValueSVGMatrix(transform.matrix, identity_matrix);
      }
    });
  }),
];
