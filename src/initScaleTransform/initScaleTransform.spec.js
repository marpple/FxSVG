import chai from "chai";
import { go, mapL, rejectL, zipL, zipWithIndexL } from "fxjs/es";
import {
  makeRandomTransformAttributeValue,
  makeRandomNumber,
  deepCopyTransformList,
  makeRandomInt,
  makeMockRect,
} from "../../test/utils/index.js";
import {
  expectSameValueSVGTransform,
  expectTransformWithScaleSxSy,
  expectTransformWithTranslateTxTy,
} from "../../test/assertions/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initScaleTransform } from "./initScaleTransform.index.js";

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
  sx: makeRandomNumber(-100, 100),
  sy: makeRandomNumber(-100, 100),
  cx: makeRandomNumber(-100, 100),
  cy: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$initScaleTransform`, function () {
    it(`The length of the SVG transform list is increased by 3.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();
        const { numberOfItems: before_length } = $$getBaseTransformList($el);

        $$initScaleTransform({ sx, sy, cx, cy, index })($el, $svg);

        const { numberOfItems: after_length } = $$getBaseTransformList($el);
        expect(after_length).equal(before_length + 3);
      }
    });

    it(`The transform at input index is a translate transform with tx = input cx, ty = input cy.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();

        $$initScaleTransform({ sx, sy, cx, cy, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index);
        expectTransformWithTranslateTxTy({ transform, tx: cx, ty: cy });
      }
    });

    it(`The transform at input index + 1 is a scale transform with input sx, sy.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();

        $$initScaleTransform({ sx, sy, cx, cy, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index + 1);
        expectTransformWithScaleSxSy({ transform, sx, sy });
      }
    });

    it(`The transform at input index + 2 is a translate transform with tx = -input cx, ty = -input cy.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();

        $$initScaleTransform({ sx, sy, cx, cy, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index + 2);
        expectTransformWithTranslateTxTy({ transform, tx: -cx, ty: -cy });
      }
    });

    it(`The function do nothing on other transforms.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy, sx, sy } = setupMockInputValues();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($el)
        );

        $$initScaleTransform({ sx, sy, cx, cy, index })($el, $svg);

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
        const { sx, sy } = setupMockInputValues();

        $$initScaleTransform({ sx, sy, index })($el, $svg);

        const transform_list = $$getBaseTransformList($el);
        const transforms = mapL((i) => transform_list.getItem(i), [
          index,
          index + 2,
        ]);
        for (const transform of transforms) {
          expectTransformWithTranslateTxTy({ transform, tx: 0, ty: 0 });
        }
      }
    });

    it(`The transform at input index + 1 is a scale transform with sx = 1, sy = 1
        when there is no input sx, sy.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el, index } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { cx, cy } = setupMockInputValues();

        $$initScaleTransform({ cx, cy, index })($el, $svg);

        const transform = $$getBaseTransformList($el).getItem(index + 1);
        expectTransformWithScaleSxSy({ transform, sx: 1, sy: 1 });
      }
    });

    it(`The transform is from index 0 to index 2 when there is no input index.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });
        const { sx, sy, cx, cy } = setupMockInputValues();

        $$initScaleTransform({ cx, cy, sx, sy })($el, $svg);

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
        expectTransformWithScaleSxSy({
          transform: transform2,
          sx,
          sy,
        });
        expectTransformWithTranslateTxTy({
          transform: transform3,
          tx: -cx,
          ty: -cy,
        });
      }
    });

    it(`The transforms at index 0 and index 2 are translate transforms with tx = 0, ty = 0
        and the transform at index 1 is a scale transform with sx = 1, sy = 1
        when there is no input object.`, function () {
      for (const $svg of setupSVGList()) {
        const { $el } = setupMockEl({
          transform: makeRandomTransformAttributeValue(),
        });

        $$initScaleTransform()($el, $svg);

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
        expectTransformWithScaleSxSy({
          transform: transform2,
          sx: 1,
          sy: 1,
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
