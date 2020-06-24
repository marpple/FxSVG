import { expect } from "chai";
import { equals2, go, map, mapL, rejectL, zipWithIndexL } from "fxjs2";
import {
  deepCopyTransformList,
  makeMockRect,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { expectTransformWithTranslateTxTy } from "../../test/assertions/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initTranslateTransform } from "./initTranslateTransform.index.js";

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

const setupMockInputValues = () => ({
  tx: makeRandomNumber(-100, 100),
  ty: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$initTranslateTransform`, function () {
    it(`The length of the SVG transform list is increased by 1.`, function () {
      const fs = mapL(($svg) => $$initTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { tx, ty } = setupMockInputValues();
        const { numberOfItems: before_length } = $$getBaseTransformList($el);

        f($el, { tx, ty, index });

        const { numberOfItems: after_length } = $$getBaseTransformList($el);
        expect(after_length).equal(before_length + 1);
      }
    });

    it(`The transform at input index is a translate transform with the input tx, ty.`, function () {
      const fs = mapL(($svg) => $$initTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { tx, ty } = setupMockInputValues();

        f($el, { tx, ty, index });

        const transform = $$getBaseTransformList($el).getItem(index);
        expectTransformWithTranslateTxTy({ transform, tx, ty });
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      const fs = mapL(($svg) => $$initTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { tx, ty } = setupMockInputValues();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        f($el, { tx, ty, index });

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

    it(`The transform at input index is a translate transform with tx = 0, ty = 0
        when there is no input tx, ty.`, function () {
      const fs = mapL(($svg) => $$initTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        f($el, { index });

        const transform = $$getBaseTransformList($el).getItem(index);
        expectTransformWithTranslateTxTy({ transform, tx: 0, ty: 0 });
      }
    });

    it(`The transform is at index 0 when there is no input index.`, function () {
      const fs = mapL(($svg) => $$initTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { tx, ty } = setupMockInputValues();

        f($el, { tx, ty });

        const transform = $$getBaseTransformList($el).getItem(0);
        expectTransformWithTranslateTxTy({ transform, tx, ty });
      }
    });

    it(`The transform at index 0 is a translate transform when there is no input object.`, function () {
      const fs = mapL(($svg) => $$initTranslateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        f($el);

        const transform = $$getBaseTransformList($el).getItem(0);
        expectTransformWithTranslateTxTy({ transform, tx: 0, ty: 0 });
      }
    });
  }),
];
