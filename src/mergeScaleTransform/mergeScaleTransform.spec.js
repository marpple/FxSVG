import { expect } from "chai";
import { each, go, mapL, rangeL, reduce } from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  makeRandomTransformAttributeValue,
  makeRandomNumber,
  makeRandomInt,
  deepCopyTransformListToMatrixList,
} from "../../test/utils/index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initScaleTransform } from "../initScaleTransform/initScaleTransform.index.js";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";
import { makeInvalidCases as makeInvalidIsValidFxSVGTransformListCases } from "../isValidFxScaleSVGTransformList/isValidFxScaleSVGTransformList.spec.js";
import { $$mergeScaleTransform } from "./mergeScaleTransform.index.js";

const createMockEl = ({ transform_attr = "" } = {}) =>
  $$el()(`
    <rect
      x="${makeRandomNumber()}"
      y="${makeRandomNumber()}"
      width="${makeRandomNumber(1)}"
      height="${makeRandomNumber(1)}"
      ${transform_attr ? `transform="${transform_attr}"` : ""}
    >
    </rect> 
  `);

const expectSameElementAndSameTransformListAfterMerge = ($el, config) => {
  const before_list = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );
  const result = $$mergeScaleTransform()($el, config);
  const after_list = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );
  expect(result).to.equal($el);
  expect(after_list).to.deep.equal(before_list);
};

export default ({ describe, it, beforeEach }) => [
  describe(`$$mergeScaleTransform`, function () {
    describe(`
      If the input values failed to pass $$isValidFxScaleSVGTransformList, the function do nothing but return the element.
    `, function () {
      go(
        makeInvalidIsValidFxSVGTransformListCases(),
        mapL(([title, $el, index]) => [`If [${title}]...`, $el, index]),
        each(([title, $el, index]) =>
          it(title, function () {
            expectSameElementAndSameTransformListAfterMerge($el, { index });
          })
        )
      );
    });

    describe(`The input values are valid for the function. (Use $$initScaleTransform)`, function () {
      let $el;
      let index;

      beforeEach(function () {
        const transform_attr = makeRandomTransformAttributeValue();
        $el = createMockEl({ transform_attr });
        const transform_list = $$getBaseTransformList($el);
        const init_index = makeRandomInt(0, transform_list.numberOfItems + 1);
        const [sx, sy, cx, cy] = mapL(
          () => makeRandomNumber(-100, 100),
          rangeL(4)
        );
        $$initScaleTransform()($el, { sx, sy, cx, cy, index: init_index });
        index = init_index + 1;
      });

      it(`The SVGTransformList's length decreases by 2.`, function () {
        const { numberOfItems: before_n } = $$getBaseTransformList($el);

        $$mergeScaleTransform()($el, { index });

        const { numberOfItems: after_n } = $$getBaseTransformList($el);
        expect(after_n).to.equal(before_n - 2);
      });

      describe(`The SVGTransform at index - 1 after merged should satisfy following conditions.`, function () {
        it(`It is a matrix SVGTransform.`, function () {
          $$mergeScaleTransform()($el, { index });

          const t = $$getBaseTransformList($el).getItem(index - 1);
          expect($$isMatrixSVGTransform(t)).to.be.true;
        });

        it(`It's matrix is same with t1.matrix * t2.matrix * t3.matrix.`, function () {
          const transform_list = $$getBaseTransformList($el);
          const before_m = go(
            rangeL(3),
            mapL((i) => index - 1 + i),
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
