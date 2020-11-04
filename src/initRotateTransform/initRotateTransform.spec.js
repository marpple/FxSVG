import chai from "chai";
import { go, mapL, rejectL, zipL, zipWithIndexL } from "fxjs";
import {
  expectSameValueSVGTransform,
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

const { expect } = chai;

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
  angle: makeRandomNumber(-700, 700),
  cx: makeRandomNumber(-100, 100),
  cy: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$initRotateTransform`, function () {
    it(`The length of the SVG transform list is increased by 3.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();
        const { numberOfItems: before_length } = $$getBaseTransformList($el);

        $$initRotateTransform({ angle, cx, cy, index })($el, $svg);

        const { numberOfItems: after_length } = $$getBaseTransformList($el);
        expect(after_length).equal(before_length + 3);
      }
    });

    it(`The transform at input index is a translate transform with tx = input cx, ty = input cy.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();

        $$initRotateTransform({ angle, cx, cy, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index);
        expectTransformWithTranslateTxTy({ transform, tx: cx, ty: cy });
      }
    });

    it(`The transform at input index + 1 is a rotate transform with the input angle, cx = 0, cy = 0.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();

        $$initRotateTransform({ angle, cx, cy, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index + 1);
        expectTransformWithRotateAngleCxCy({ transform, angle, cx: 0, cy: 0 });
      }
    });

    it(`The transform at input index + 2 is a translate transform with tx = -input cx, ty = -input cy.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();

        $$initRotateTransform({ angle, cx, cy, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index + 2);
        expectTransformWithTranslateTxTy({ transform, tx: -cx, ty: -cy });
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        $$initRotateTransform({ angle, cx, cy, index })($el, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );
        expect(after_transform_list.length).equal(
          before_transform_list.length + 3
        );
        const pairs = go(
          after_transform_list,
          zipWithIndexL,
          rejectL(([i]) => i >= index && i <= index + 2),
          mapL(([, transform]) => transform),
          zipL(before_transform_list)
        );
        for (const [before_transform, after_transform] of pairs) {
          expectSameValueSVGTransform(after_transform, before_transform);
        }
      }
    });

    it(`The transforms at input index and input index + 2 are translate transforms with tx = 0, ty = 0
        when there are no input cx, cy.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle } = setupMockInputValues();

        $$initRotateTransform({ angle, index })($el, $svg);

        const transform_list = $$getBaseTransformList($el);
        const [transform1, transform2] = mapL(
          (i) => transform_list.getItem(i),
          [index, index + 2]
        );
        expectTransformWithTranslateTxTy({
          transform: transform1,
          tx: 0,
          ty: 0,
        });
        expectTransformWithTranslateTxTy({
          transform: transform2,
          tx: 0,
          ty: 0,
        });
      }
    });

    it(`The transform at input index + 1 is a rotate transform with angle = 0, cx = 0, cy = 0
        when there is no input angle.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy } = setupMockInputValues();

        $$initRotateTransform({ cx, cy, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index + 1);
        expectTransformWithRotateAngleCxCy({
          transform,
          angle: 0,
          cx: 0,
          cy: 0,
        });
      }
    });

    it(`The transform is from index 0 to index 2 when there is no input index.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { angle, cx, cy } = setupMockInputValues();

        $$initRotateTransform({ angle, cx, cy })($el, $svg);

        const transform_list = $$getBaseTransformList($el);
        const [transform1, transform2, transform3] = mapL(
          (i) => transform_list.getItem(i),
          [0, 1, 2]
        );
        expectTransformWithTranslateTxTy({
          transform: transform1,
          tx: cx,
          ty: cy,
        });
        expectTransformWithRotateAngleCxCy({
          transform: transform2,
          angle,
          cx: 0,
          cy: 0,
        });
        expectTransformWithTranslateTxTy({
          transform: transform3,
          tx: -cx,
          ty: -cy,
        });
      }
    });

    it(`The transforms at index 0 and index 2 are translate transforms with tx = 0, ty = 0
        and the transform at index 1 is a rotate transform with angle = 0, cx = 0, cy = 0
        when there is no input object.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        $$initRotateTransform()($el, $svg);

        const transform_list = $$getBaseTransformList($el);
        const [transform1, transform2, transform3] = mapL(
          (i) => transform_list.getItem(i),
          [0, 1, 2]
        );
        expectTransformWithTranslateTxTy({
          transform: transform1,
          tx: 0,
          ty: 0,
        });
        expectTransformWithRotateAngleCxCy({
          transform: transform2,
          angle: 0,
          cx: 0,
          cy: 0,
        });
        expectTransformWithTranslateTxTy({
          transform: transform3,
          tx: 0,
          ty: 0,
        });
      }
    });
  }),
];
