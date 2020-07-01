import { expect } from "chai";
import { each, equals2, go, mapL, rejectL, zipL, zipWithIndexL } from "fxjs2";
import {
  deepCopyTransformList,
  makeMockRect,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import {
  expectSameValueSVGTransform,
  expectTransformWithTranslateTxTy,
} from "../../test/assertions/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initTranslateTransform } from "./initTranslateTransform.index.js";

const setupSVGList = () => [
  undefined,
  document.createElementNS("http://www.w3.org/2000/svg", "svg"),
];

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
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { tx, ty } = setupMockInputValues();
        const { numberOfItems: before_length } = $$getBaseTransformList($el);

        $$initTranslateTransform({ tx, ty, index })($el, $svg);

        const { numberOfItems: after_length } = $$getBaseTransformList($el);
        expect(after_length).equal(before_length + 1);
      }
    });

    it(`The transform at input index is a translate transform with the input tx, ty.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { tx, ty } = setupMockInputValues();

        $$initTranslateTransform({ tx, ty, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index);
        expectTransformWithTranslateTxTy({ transform, tx, ty });
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { tx, ty } = setupMockInputValues();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        $$initTranslateTransform({ tx, ty, index })($el, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );
        expect(after_transform_list.length).equal(
          before_transform_list.length + 1
        );
        go(
          after_transform_list,
          zipWithIndexL,
          rejectL(([i]) => equals2(index, i)),
          mapL(([, transform]) => transform),
          zipL(before_transform_list),
          each(([before_transform, after_transform]) =>
            expectSameValueSVGTransform(after_transform, before_transform)
          )
        );
      }
    });

    it(`The transform at input index is a translate transform with tx = 0, ty = 0
        when there is no input tx, ty.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        $$initTranslateTransform({ index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index);
        expectTransformWithTranslateTxTy({ transform, tx: 0, ty: 0 });
      }
    });

    it(`The transform is at index 0 when there is no input index.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { tx, ty } = setupMockInputValues();

        $$initTranslateTransform({ tx, ty })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(0);
        expectTransformWithTranslateTxTy({ transform, tx, ty });
      }
    });

    it(`The transform at index 0 is a translate transform when there is no input object.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        $$initTranslateTransform()($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(0);
        expectTransformWithTranslateTxTy({ transform, tx: 0, ty: 0 });
      }
    });
  }),
];
