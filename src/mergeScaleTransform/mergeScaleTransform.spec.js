import { expect } from "chai";
import { each, go, mapL, rangeL, reduce } from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeMockRectInitiatedScaleTransform,
} from "../../test/utils/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";
import { makeInvalidCases as makeInvalidIsValidFxSVGTransformListCases } from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.spec.js";
import { $$mergeScaleTransform } from "./mergeScaleTransform.index.js";

export default ({ describe, it }) => [
  describe(`$$mergeScaleTransform`, function () {
    describe(`
      If the input values failed to pass $$isValidFxScaleSVGTransformList, the function do nothing but return the element.
    `, function () {
      go(
        makeInvalidIsValidFxSVGTransformListCases(),
        mapL(({ description: title, $el, index }) => [
          `If [${title}]...`,
          $el,
          index,
        ]),
        each(([title, $el, index]) =>
          it(title, function () {
            const before_list = deepCopyTransformList(
              $$getBaseTransformList($el)
            );
            const result = $$mergeScaleTransform()($el, { index });
            const after_list = deepCopyTransformList(
              $$getBaseTransformList($el)
            );
            expect(result).to.equal($el);
            expect(after_list).to.deep.equal(before_list);
          })
        )
      );
    });

    describe(`The input values are valid for the function. (Use $$initScaleTransform)`, function () {
      it(`The SVGTransformList's length decreases by 2.`, function () {
        const { $el, index } = makeMockRectInitiatedScaleTransform();
        const { numberOfItems: before_n } = $$getBaseTransformList($el);

        $$mergeScaleTransform()($el, { index });

        const { numberOfItems: after_n } = $$getBaseTransformList($el);
        expect(after_n).to.equal(before_n - 2);
      });

      describe(`The SVGTransform at index - 1 after merged should satisfy following conditions.`, function () {
        it(`It is a matrix SVGTransform.`, function () {
          const { $el, index } = makeMockRectInitiatedScaleTransform();
          $$mergeScaleTransform()($el, { index });

          const t = $$getBaseTransformList($el).getItem(index - 1);
          expect($$isMatrixSVGTransform(t)).to.be.true;
        });

        it(`It's matrix is same with t1.matrix * t2.matrix * t3.matrix.`, function () {
          const { $el, index } = makeMockRectInitiatedScaleTransform();
          const transform_list = $$getBaseTransformList($el);
          const before_m = go(
            rangeL(index - 1, index + 2),
            mapL((i) => transform_list.getItem(i)),
            mapL(({ matrix }) => matrix),
            reduce((m1, m2) => m1.multiply(m2))
          );

          $$mergeScaleTransform()($el, { index });
          const { matrix: after_m } = transform_list.getItem(index - 1);
          expectSameValueSVGMatrix(after_m, before_m);
        });
      });
    });
  }),
];
