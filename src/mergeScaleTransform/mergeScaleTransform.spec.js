import { expect } from "chai";
import {
  each,
  equals2,
  flatMapL,
  go,
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

export default ({ describe, it }) => [
  describe(`$$mergeScaleTransform`, function () {
    it(`The function do nothing but return the input element
        when the input values failed to pass "$$isValidFxScaleSVGTransformList".`, function () {
      this.slow(1000);

      const cases = go(
        [
          undefined,
          document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        ],
        mapL($$mergeScaleTransform),
        flatMapL((f) =>
          mapL(
            ({ description, $el, index }) => ({ description, $el, index, f }),
            makeInvalidIsValidFxSVGTransformListCases()
          )
        )
      );
      for (const { $el: $input, description, index, f } of cases) {
        const before_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        const $output = f($input, { index });

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        expect($output, description).equal($input);
        expect(after_transform_list.length, description).equal(
          before_transform_list.length
        );
        go(
          after_transform_list,
          zipL(before_transform_list),
          each(([before_transform, after_transform]) =>
            expectSameValueSVGTransform(
              after_transform,
              before_transform,
              description
            )
          )
        );
      }
    });

    it(`The transform "translate(cx, cy)" at the input index - 1,
        the transform "scale(sx, sy)" at the input index,
        the transform "translate(-cx, -cy)" at the input index + 1
        are merge to the matrix transform of the multiplication of transforms.
        So the length of the transform list is decreased by 2.`, function () {
      const fs = mapL($$mergeScaleTransform, [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ]);
      for (const f of fs) {
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

        const $output = f($input, { index });

        const after_transform_list = deepCopyTransformList(
          $$getBaseTransformList($input)
        );

        expect($output).equal($input);
        expect(after_transform_list.length).equal(
          before_transform_list.length - 2
        );
        go(
          before_transform_list,
          zipWithIndexL,
          rejectL(([i]) => equals2(i, index - 1) || equals2(i, index + 1)),
          mapL(([i, transform]) => {
            if (equals2(i, index)) {
              return go(
                [
                  $$createSVGTransformTranslate()({ tx: cx, ty: cy }),
                  $$createSVGTransformScale()({ sx, sy }),
                  $$createSVGTransformTranslate()({ tx: -cx, ty: -cy }),
                ],
                mapL(({ matrix }) => matrix),
                reduce((m1, m2) => m1.multiply(m2)),
                (matrix) => $$createSVGTransformMatrix({ matrix })()
              );
            }
            return transform;
          }),
          zipL(after_transform_list),
          each(([receive_transform, expect_transform]) =>
            expectSameValueSVGTransform(receive_transform, expect_transform)
          )
        );
      }
    });
  }),
];
