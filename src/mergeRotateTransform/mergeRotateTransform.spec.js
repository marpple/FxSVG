import { expect } from "chai";
import { appendL, each, go, mapL, object, rangeL, reduce } from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  deepCopyTransformList,
  makeAllCombinations,
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$appendTranslateTransform } from "../appendTranslateTransform/appendTranslateTransform.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initRotateTransform } from "../initRotateTransform/initRotateTransform.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$mergeRotateTransform } from "./mergeRotateTransform.index.js";

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
  const before_list = deepCopyTransformList(
    $$getBaseTransformList($el)
  );
  const result = $$mergeRotateTransform()($el, config);
  const after_list = deepCopyTransformList(
    $$getBaseTransformList($el)
  );
  expect(result).to.equal($el);
  expect(after_list).to.deep.equal(before_list);
};

export default ({ describe, it, beforeEach }) => [
  describe(`$$mergeRotateTransform`, function () {
    describe(`
  If the input values are invalid, the function do nothing but return the element.
  `, function () {
      let $el;
      let index;

      beforeEach(function () {
        const transform_attr = makeRandomTransformAttributeValue(3);
        $el = createMockEl({ transform_attr });
        index = makeRandomInt(1, $$getBaseTransformList($el).numberOfItems - 1);
      });

      it("The element has no transform.", function () {
        go(
          ["index"],
          makeAllCombinations,
          mapL((ks) => [createMockEl(), ks]),
          mapL(([$el, ks]) =>
            go(
              ks,
              mapL((k) => [k, makeRandomInt()]),
              object,
              (config) => [$el, config]
            )
          ),
          appendL([createMockEl()]),
          each(([$el, config]) =>
            expectSameElementAndSameTransformListAfterMerge($el, config)
          )
        );
      });

      it(`The input index is out of bounds to the element's SVGTransformList.`, function () {
        const $el = createMockEl({
          transform_attr: makeRandomTransformAttributeValue(),
        });
        const index = makeRandomInt(
          $$getBaseTransformList($el).numberOfItems - 1
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      describe(`The SVGTransform at index - 1 should be a translate SVGTransform.`, function () {
        it(`Use a matrix SVGTransform.`, function () {
          const matrix = makeRandomSVGMatrix();
          const t = $$createSVGTransformMatrix()({ matrix });
          $$getBaseTransformList($el).insertItemBefore(t, index - 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`Use a rotate SVGTransform.`, function () {
          const t = $$createSVGTransformRotate()({
            angle: makeRandomNumber(),
            cx: makeRandomNumber(),
            cy: makeRandomNumber(),
          });
          $$getBaseTransformList($el).insertItemBefore(t, index - 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`Use a scale SVGTransform.`, function () {
          const t = $$createSVGTransformScale()({
            sx: makeRandomNumber(),
            sy: makeRandomNumber(),
          });
          $$getBaseTransformList($el).insertItemBefore(t, index - 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });
      });

      describe(`The SVGTransform at index should be a rotate SVGTransform.`, function () {
        it(`Use a matrix SVGTransform.`, function () {
          const matrix = makeRandomSVGMatrix();
          const t = $$createSVGTransformMatrix()({ matrix });
          $$getBaseTransformList($el).insertItemBefore(t, index);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`Use a translate SVGTransform.`, function () {
          const t = $$createSVGTransformTranslate()({
            tx: makeRandomNumber(),
            ty: makeRandomNumber(),
          });
          $$getBaseTransformList($el).insertItemBefore(t, index);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`Use a scale SVGTransform.`, function () {
          const t = $$createSVGTransformScale()({
            sx: makeRandomNumber(),
            sy: makeRandomNumber(),
          });
          $$getBaseTransformList($el).insertItemBefore(t, index);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });
      });

      describe(`The SVGTransform at index + 1 should be a translate SVGTransform.`, function () {
        it(`Use a matrix SVGTransform.`, function () {
          const matrix = makeRandomSVGMatrix();
          const t = $$createSVGTransformMatrix()({ matrix });
          $$getBaseTransformList($el).insertItemBefore(t, index + 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`Use a rotate SVGTransform.`, function () {
          const t = $$createSVGTransformRotate()({
            angle: makeRandomNumber(),
            cx: makeRandomNumber(),
            cy: makeRandomNumber(),
          });
          $$getBaseTransformList($el).insertItemBefore(t, index + 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`Use a scale SVGTransform.`, function () {
          const t = $$createSVGTransformScale()({
            sx: makeRandomNumber(),
            sy: makeRandomNumber(),
          });
          $$getBaseTransformList($el).insertItemBefore(t, index + 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });
      });

      it(`The cx, cy of the SVGTransform at index should be 0.`, function () {
        $$initRotateTransform()($el, {
          angle: makeRandomNumber(),
          cx: makeRandomNumber(),
          cy: makeRandomNumber(),
          index: index - 1,
        });
        const t = $$getBaseTransformList($el).getItem(index);
        t.setRotate(t.angle, makeRandomNumber(1), makeRandomNumber(1));

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`(SVGTransform at index - 1).e + (SVGTransform at index + 1).e should be 0.`, function () {
        $$initRotateTransform()($el, {
          angle: makeRandomNumber(),
          cx: makeRandomNumber(),
          cy: makeRandomNumber(),
          index: index - 1,
        });
        $$appendTranslateTransform(
          $$getBaseTransformList($el).getItem(index - 1),
          { tx: 1 }
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`(SVGTransform at index - 1).f + (SVGTransform at index + 1).f should be 0.`, function () {
        $$initRotateTransform()($el, {
          angle: makeRandomNumber(),
          cx: makeRandomNumber(),
          cy: makeRandomNumber(),
          index: index - 1,
        });
        $$appendTranslateTransform(
          $$getBaseTransformList($el).getItem(index - 1),
          { ty: 1 }
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });
    });

    describe(`The input values are valid for the function. (Use $$initRotateTransform)`, function () {
      let $el;
      let index;

      beforeEach(function () {
        const transform_attr = makeRandomTransformAttributeValue(3);
        $el = createMockEl({ transform_attr });
        index = makeRandomInt(1, $$getBaseTransformList($el).numberOfItems - 1);

        $$initRotateTransform()($el, {
          angle: makeRandomNumber(),
          cx: makeRandomNumber(),
          cy: makeRandomNumber(),
          index: index - 1,
        });
      });

      it(`The SVGTransformList's length decreases by 2.`, function () {
        const { numberOfItems: before_n } = $$getBaseTransformList($el);

        $$mergeRotateTransform()($el, { index });

        const { numberOfItems: after_n } = $$getBaseTransformList($el);

        expect(after_n).to.equal(before_n - 2);
      });

      describe(`The SVGTransform at index - 1 after merged should satisfy following conditions.`, function () {
        it(`It is a rotate SVGTransform.`, function () {
          $$mergeRotateTransform()($el, { index });

          const t = $$getBaseTransformList($el).getItem(index - 1);
          expect($$isRotateSVGTransform(t)).to.be.true;
        });

        it(`It's angle is same with the angle of the SVGTransform at index before merged.`, function () {
          const { angle: before_angle } = $$getBaseTransformList($el).getItem(
            index
          );

          $$mergeRotateTransform()($el, { index });

          const { angle: after_angle } = $$getBaseTransformList($el).getItem(
            index - 1
          );

          expect(after_angle).to.equal(before_angle);
        });

        it(`It's matrix is same with t1.matrix * t2.matrix * t3.matrix.`, function () {
          const list = $$getBaseTransformList($el);
          const m = go(
            rangeL(3),
            mapL((i) => index + i - 1),
            mapL((i) => list.getItem(i)),
            mapL(({ matrix: m }) => m),
            reduce((m1, m2) => m1.multiply(m2))
          );

          $$mergeRotateTransform()($el, { index });

          expectSameValueSVGMatrix(
            $$getBaseTransformList($el).getItem(index - 1).matrix,
            m
          );
        });
      });
    });
  }),
];
