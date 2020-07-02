import { expect } from "chai";
import {
  equals2,
  extend,
  flatMapL,
  go,
  map,
  mapL,
  reduce,
  rejectL,
  zipL,
  zipWithIndexL,
} from "fxjs2";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeMockRectInitiatedScaleTransform,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { makeInvalidCases as makeInvalidIsValidFxSVGTransformListCases } from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.spec.js";
import { $$mergeScaleTransform } from "./mergeScaleTransform.index.js";

const setupSVGList = () => [
  undefined,
  document.createElementNS("http://www.w3.org/2000/svg", "svg"),
];

const expectSameValueTransformList = (
  receive_transform_list,
  expect_transform_list,
  description = "expectSameValueTransformList"
) => {
  expect(receive_transform_list.length, description).equal(
    expect_transform_list.length
  );
  const pairs = zipL(receive_transform_list, expect_transform_list);
  for (const [receive_transform, expect_transform] of pairs) {
    expectSameValueSVGTransform(
      receive_transform,
      expect_transform,
      description
    );
  }
};

export default ({ describe, it }) => [
  describe(`$$mergeScaleTransform`, function () {
    it(`The function do nothing but return the input element
        when the input values failed to pass "$$isValidFxScaleSVGTransformList".`, function () {
      this.slow(1000);

      const cases = flatMapL(
        ($svg) =>
          mapL(
            (obj) => extend(obj, { $svg }),
            makeInvalidIsValidFxSVGTransformListCases()
          ),
        setupSVGList()
      );
      for (const { $el: $input, description, index, $svg } of cases) {
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeScaleTransform({ index })($input, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        expect($output, description).equal($input);
        expectSameValueTransformList(
          after_transform_list,
          before_transform_list,
          description
        );
      }
    });

    it(`The transform "translate(cx, cy)" at the input index - 1,
        the transform "scale(sx, sy)" at the input index,
        the transform "translate(-cx, -cy)" at the input index + 1
        are merge to the matrix transform of the multiplication of transforms.
        So the length of the transform list is decreased by 2.`, function () {
      for (const $svg of setupSVGList()) {
        const {
          $el: $input,
          index,
          sx,
          sy,
          cx,
          cy,
        } = makeMockRectInitiatedScaleTransform();
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = $$mergeScaleTransform({ index })($input, $svg);

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );
        expect($output).equal($input);
        const expect_transform_list = go(
          before_transform_list,
          zipWithIndexL,
          rejectL(([i]) => equals2(i, index - 1) || equals2(i, index + 1)),
          map(([i, transform]) => {
            if (equals2(i, index)) {
              return go(
                [
                  $$createSVGTransformTranslate({ tx: cx, ty: cy })(),
                  $$createSVGTransformScale({ sx, sy })(),
                  $$createSVGTransformTranslate({ tx: -cx, ty: -cy })(),
                ],
                mapL(({ matrix }) => matrix),
                reduce((m1, m2) => m1.multiply(m2)),
                (matrix) => $$createSVGTransformMatrix({ matrix })()
              );
            }

            return transform;
          })
        );
        expectSameValueTransformList(
          after_transform_list,
          expect_transform_list
        );
      }
    });
  }),
];
