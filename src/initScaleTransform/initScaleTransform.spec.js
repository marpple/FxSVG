import { expect } from "chai";
import { go, map, mapL, rejectL, zipWithIndexL } from "fxjs2";
import {
  makeRandomTransformAttributeValue,
  makeRandomNumber,
  deepCopyTransformList,
  makeRandomInt,
  makeMockRect,
} from "../../test/utils/index.js";
import {
  expectTransformWithScaleSxSy,
  expectTransformWithTranslateTxTy,
} from "../../test/assertions/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initScaleTransform } from "./initScaleTransform.index.js";

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

const setupMockInputValues = () => ({
  sx: makeRandomNumber(-100, 100),
  sy: makeRandomNumber(-100, 100),
  cx: makeRandomNumber(-100, 100),
  cy: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$initScaleTransform`, function () {
    it(`The length of the SVG transform list is increased by 3.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();
        const { numberOfItems: before_length } = $$getBaseTransformList($el);

        f($el, { sx, sy, cx, cy, index });

        const { numberOfItems: after_length } = $$getBaseTransformList($el);
        expect(after_length).equal(before_length + 3);
      }
    });

    it(`The transform at input index is a translate transform with tx = input cx, ty = input cy.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();

        f($el, { sx, sy, cx, cy, index });

        const transform = $$getBaseTransformList($el).getItem(index);
        expectTransformWithTranslateTxTy({ transform, tx: cx, ty: cy });
      }
    });

    it(`The transform at input index + 1 is a scale transform with input sx, sy.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();

        f($el, { sx, sy, cx, cy, index });

        const transform = $$getBaseTransformList($el).getItem(index + 1);
        expectTransformWithScaleSxSy({ transform, sx, sy });
      }
    });

    it(`The transform at input index + 2 is a translate transform with tx = -input cx, ty = -input cy.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();

        f($el, { sx, sy, cx, cy, index });

        const transform = $$getBaseTransformList($el).getItem(index + 2);
        expectTransformWithTranslateTxTy({ transform, tx: -cx, ty: -cy });
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        f($el, { sx, sy, cx, cy, index });

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );
        expect(
          go(
            after_transform_list,
            zipWithIndexL,
            rejectL(([i]) => i >= index && i <= index + 2),
            map(([, transform]) => transform)
          )
        ).deep.equal(before_transform_list);
      }
    });

    it(`The transforms at input index and input index + 2 are translate transforms with tx = 0, ty = 0
        when there are no input cx, cy.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { sx, sy } = setupMockInputValues();

        f($el, { sx, sy, index });

        expectTransformWithTranslateTxTy({
          transform: $$getBaseTransformList($el).getItem(index),
          tx: 0,
          ty: 0,
        });
        expectTransformWithTranslateTxTy({
          transform: $$getBaseTransformList($el).getItem(index + 2),
          tx: 0,
          ty: 0,
        });
      }
    });

    it(`The transform at input index + 1 is a scale transform with sx = 1, sy = 1
        when there is no input sx, sy.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy } = setupMockInputValues();

        f($el, { cx, cy, index });

        expectTransformWithScaleSxSy({
          transform: $$getBaseTransformList($el).getItem(index + 1),
          sx: 1,
          sy: 1,
        });
      }
    });

    it(`The transform is from index 0 to index 2 when there is no input index.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { sx, sy, cx, cy } = setupMockInputValues();

        f($el, { sx, sy, cx, cy });

        expectTransformWithTranslateTxTy({
          transform: $$getBaseTransformList($el).getItem(0),
          tx: cx,
          ty: cy,
        });
        expectTransformWithScaleSxSy({
          transform: $$getBaseTransformList($el).getItem(1),
          sx,
          sy,
        });
        expectTransformWithTranslateTxTy({
          transform: $$getBaseTransformList($el).getItem(2),
          tx: -cx,
          ty: -cy,
        });
      }
    });

    it(`The transforms at index 0 and index 2 are translate transforms with tx = 0, ty = 0
        and the transform at index 1 is a scale transform with sx = 1, sy = 1
        when there is no input object.`, function () {
      const fs = mapL(($svg) => $$initScaleTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        f($el);

        expectTransformWithTranslateTxTy({
          transform: $$getBaseTransformList($el).getItem(0),
          tx: 0,
          ty: 0,
        });
        expectTransformWithScaleSxSy({
          transform: $$getBaseTransformList($el).getItem(1),
          sx: 1,
          sy: 1,
        });
        expectTransformWithTranslateTxTy({
          transform: $$getBaseTransformList($el).getItem(2),
          tx: 0,
          ty: 0,
        });
      }
    });
  }),
];
