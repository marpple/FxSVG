import { expect } from "chai";
import { go, map, mapL, rejectL, zipWithIndexL } from "fxjs2";
import {
  expectTransformWithRotateAngleCxCy,
  expectTransformWithTranslateTxTy,
} from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeMockRect,
  makeRandomInt,
  makeRandomNumber,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initRotateTransform } from "./initRotateTransform.index.js";

const setupMockEl = ({ transform } = {}) => {
  const $el = makeMockRect({ transform });
  const index = makeRandomInt(0, $$getBaseTransformList($el).numberOfItems + 1);
  return { $el, index };
};

const setupMockInputValues = () => ({
  angle: makeRandomNumber(-700, 700),
  cx: makeRandomNumber(-100, 100),
  cy: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$initRotateTransform`, function () {
    it(`The length of the SVG transform list is increased by 3.`, function () {
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();
        const { numberOfItems: before_length } = $$getBaseTransformList($el);

        f($el, { angle, cx, cy, index });

        const { numberOfItems: after_length } = $$getBaseTransformList($el);
        expect(after_length).equal(before_length + 3);
      }
    });

    it(`The transform at input index is a translate transform with tx = input cx, ty = input cy.`, function () {
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();

        f($el, { angle, cx, cy, index });

        const transform = $$getBaseTransformList($el).getItem(index);
        expectTransformWithTranslateTxTy({ transform, tx: cx, ty: cy });
      }
    });

    it(`The transform at input index + 1 is a rotate transform with the input angle, cx = 0, cy = 0.`, function () {
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();

        f($el, { angle, cx, cy, index });

        const transform = $$getBaseTransformList($el).getItem(index + 1);
        expectTransformWithRotateAngleCxCy({ transform, angle, cx: 0, cy: 0 });
      }
    });

    it(`The transform at input index + 2 is a translate transform with tx = -input cx, ty = -input cy.`, function () {
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();

        f($el, { angle, cx, cy, index });

        const transform = $$getBaseTransformList($el).getItem(index + 2);
        expectTransformWithTranslateTxTy({ transform, tx: -cx, ty: -cy });
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        f($el, { angle, cx, cy, index });

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
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle } = setupMockInputValues();

        f($el, { angle, index });

        const transform_list = $$getBaseTransformList($el);
        expectTransformWithTranslateTxTy({
          transform: transform_list.getItem(index),
          tx: 0,
          ty: 0,
        });
        expectTransformWithTranslateTxTy({
          transform: transform_list.getItem(index + 2),
          tx: 0,
          ty: 0,
        });
      }
    });

    it(`The transform at input index + 1 is a rotate transform with angle = 0, cx = 0, cy = 0
        when there is no input angle.`, function () {
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy } = setupMockInputValues();

        f($el, { cx, cy, index });

        expectTransformWithRotateAngleCxCy({
          transform: $$getBaseTransformList($el).getItem(index + 1),
          angle: 0,
          cx: 0,
          cy: 0,
        });
      }
    });

    it(`The transform is from index 0 to index 2 when there is no input index.`, function () {
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();

        f($el, { angle, cx, cy });

        const transform_list = $$getBaseTransformList($el);
        expectTransformWithTranslateTxTy({
          transform: transform_list.getItem(0),
          tx: cx,
          ty: cy,
        });
        expectTransformWithRotateAngleCxCy({
          transform: transform_list.getItem(1),
          angle,
          cx: 0,
          cy: 0,
        });
        expectTransformWithTranslateTxTy({
          transform: transform_list.getItem(2),
          tx: -cx,
          ty: -cy,
        });
      }
    });

    it(`The transforms at index 0 and index 2 are translate transforms with tx = 0, ty = 0
        and the transform at index 1 is a rotate transform with angle = 0, cx = 0, cy = 0
        when there is no input object.`, function () {
      const fs = mapL(($svg) => $$initRotateTransform($svg), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);

      for (const f of fs) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        f($el);

        const transform_list = $$getBaseTransformList($el);
        expectTransformWithTranslateTxTy({
          transform: transform_list.getItem(0),
          tx: 0,
          ty: 0,
        });
        expectTransformWithRotateAngleCxCy({
          transform: transform_list.getItem(1),
          angle: 0,
          cx: 0,
          cy: 0,
        });
        expectTransformWithTranslateTxTy({
          transform: transform_list.getItem(2),
          tx: 0,
          ty: 0,
        });
      }
    });
  }),
];
