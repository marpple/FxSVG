import { expect } from "chai";
import { equals2, go, map, mapL, rejectL, zipWithIndexL } from "fxjs2";
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

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

export default ({ describe, it }) => [
  describe(`$$initMatrixTransform`, function () {
    it(`The length of the SVG transform list is increased by 1. `, function () {
      const fs = mapL(($svg) => $$initMatrixTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));
        const { numberOfItems: before_length } = $$getBaseTransformList($el);

        f($el, { matrix, index });

        const { numberOfItems: after_length } = $$getBaseTransformList($el);
        expect(after_length).equal(before_length + 1);
      }
    });

    it(`The transform at input index is a matrix transform with the input matrix.`, function () {
      const fs = mapL(($svg) => $$initMatrixTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));

        f($el, { matrix, index });

        const transform = $$getBaseTransformList($el).getItem(index);
        expect(transform.matrix).deep.equal(matrix);
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      const fs = mapL(($svg) => $$initMatrixTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        f($el, { matrix, index });

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );
        expect(
          go(
            after_transform_list,
            zipWithIndexL,
            rejectL(([i]) => equals2(index, i)),
            map(([, transform]) => transform)
          )
        ).deep.equal(before_transform_list);
      }
    });

    it(`The transform at input index is an identity matrix when there is no input matrix.`, function () {
      const fs = mapL(($svg) => $$initMatrixTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        f($el, { index });

        const transform = $$getBaseTransformList($el).getItem(index);
        expect(transform.matrix).deep.equal($$createSVGMatrix()());
      }
    });

    it(`The transform is at index 0 when there is no input index.`, function () {
      const fs = mapL(($svg) => $$initMatrixTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));

        f($el, { matrix });

        const transform = $$getBaseTransformList($el).getItem(0);
        expect(transform.matrix).deep.equal(matrix);
      }
    });

    it(`The transform at index 0 is an identity matrix when there is no input object.`, function () {
      const fs = mapL(($svg) => $$initMatrixTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        f($el);

        const transform = $$getBaseTransformList($el).getItem(0);
        expect(transform.matrix).deep.equal($$createSVGMatrix()());
      }
    });
  }),
];
