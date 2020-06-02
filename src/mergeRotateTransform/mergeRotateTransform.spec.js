import { expect } from "chai";
import { go, go1, join, mapL, rangeL, reduce } from "fxjs2";
import { deepCopyTransformListToMatrixList } from "../../test/utils/deepCopyTransformListToMatrixList.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomSVGMatrix } from "../../test/utils/makeRandomSVGMatrix.js";
import { makeRandomTransformAttributeValue } from "../../test/utils/makeRandomTransformAttributeValue.js";
import { makeRandomTransformString } from "../../test/utils/makeRandomTransformString.js";
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

const expectSameElementAndSameTransformListAfterMerge = ($el) => {
  const before_list = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );
  const result = $$mergeRotateTransform()($el);
  const after_list = deepCopyTransformListToMatrixList(
    $$getBaseTransformList($el)
  );
  expect(result).to.equal($el);
  expect(after_list).to.deep.equal(before_list);
};

describe(`$$mergeRotateTransform`, function () {
  let $el;

  beforeEach(function () {
    $el = $$el()(`
      <rect
        x="${makeRandomNumber()}"
        y="${makeRandomNumber()}"
        width="${makeRandomNumber(1)}"
        height="${makeRandomNumber(1)}"
        ${go1(makeRandomTransformAttributeValue(3), (t) =>
          t ? `transform="${t}"` : ""
        )}
      >
      </rect> 
    `);
  });

  describe(`
  If the first three SVGTransforms are not matched with the given conditions,
  the function do nothing but return the element.
  `, function () {
    describe(`The element have SVGTransforms less than 3.`, function () {
      beforeEach(function () {
        $el.removeAttributeNS(null, "transform");
      });

      it("Have no SVGTransform.", function () {
        expectSameElementAndSameTransformListAfterMerge($el);
      });

      it("Have 1 SVGTransform.", function () {
        $el.setAttributeNS(null, "transform", makeRandomTransformString());

        expectSameElementAndSameTransformListAfterMerge($el);
      });

      it("Have 2 SVGTransforms.", function () {
        $el.setAttributeNS(
          null,
          "transform",
          go(
            rangeL(2),
            mapL(() => makeRandomTransformString()),
            join(" ")
          )
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });
    });

    describe(`The first SVGTransform should be a translate SVGTransform.`, function () {
      it(`Use a matrix SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformMatrix()({ matrix: makeRandomSVGMatrix() }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });

      it(`Use a rotate SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformRotate()({
            angle: makeRandomNumber(),
            cx: makeRandomNumber(),
            cy: makeRandomNumber(),
          }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });

      it(`Use a scale SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformScale()({
            sx: makeRandomNumber(),
            sy: makeRandomNumber(),
          }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });
    });

    describe(`The second SVGTransform should be a rotate SVGTransform.`, function () {
      it(`Use a matrix SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformMatrix()({ matrix: makeRandomSVGMatrix() }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });

      it(`Use a translate SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformTranslate()({
            tx: makeRandomNumber(),
            ty: makeRandomNumber(),
          }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });

      it(`Use a scale SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformScale()({
            sx: makeRandomNumber(),
            sy: makeRandomNumber(),
          }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });
    });

    describe(`The third SVGTransform should be a translate SVGTransform.`, function () {
      it(`Use a matrix SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformMatrix()({ matrix: makeRandomSVGMatrix() }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });

      it(`Use a rotate SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformRotate()({
            angle: makeRandomNumber(),
            cx: makeRandomNumber(),
            cy: makeRandomNumber(),
          }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });

      it(`Use a scale SVGTransform.`, function () {
        $$getBaseTransformList($el).insertItemBefore(
          $$createSVGTransformScale()({
            sx: makeRandomNumber(),
            sy: makeRandomNumber(),
          }),
          0
        );

        expectSameElementAndSameTransformListAfterMerge($el);
      });
    });

    it(`The cx, cy of the second SVGTransform should be 0.`, function () {
      $$initRotateTransform()($el, {
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      const t = $$getBaseTransformList($el).getItem(1);
      t.setRotate(t.angle, makeRandomNumber(1), makeRandomNumber(1));

      expectSameElementAndSameTransformListAfterMerge($el);
    });

    it(`The sum of the first SVGTransform's e and the third SVGTransform's e should be 0.`, function () {
      $$initRotateTransform()($el, {
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      $$appendTranslateTransform($$getBaseTransformList($el).getItem(0), {
        tx: 1,
      });

      expectSameElementAndSameTransformListAfterMerge($el);
    });

    it(`The sum of the first SVGTransform's f and the third SVGTransform's f should be 0.`, function () {
      $$initRotateTransform()($el, {
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      $$appendTranslateTransform($$getBaseTransformList($el).getItem(0), {
        ty: 1,
      });

      expectSameElementAndSameTransformListAfterMerge($el);
    });
  });

  describe(`The element has valid SVGTransformList for the function. (Use $$initRotateTransform)`, function () {
    beforeEach(function () {
      $$initRotateTransform()($el, {
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
    });

    it(`The SVGTransformList's length decreases by 2.`, function () {
      const { numberOfItems: before_n } = $$getBaseTransformList($el);

      $$mergeRotateTransform()($el);

      const { numberOfItems: after_n } = $$getBaseTransformList($el);

      expect(after_n).to.equal(before_n - 2);
    });

    describe(`The first SVGTransform after merged should satisfy following conditions.`, function () {
      it(`It is a rotate SVGTransform.`, function () {
        $$mergeRotateTransform()($el);

        const t = $$getBaseTransformList($el).getItem(0);
        expect($$isRotateSVGTransform(t)).to.be.true;
      });

      it(`It's angle is same with the angle of the second SVGTransform before merged.`, function () {
        const { angle: before_angle } = $$getBaseTransformList($el).getItem(1);

        $$mergeRotateTransform()($el);

        const { angle: after_angle } = $$getBaseTransformList($el).getItem(0);

        expect(after_angle).to.equal(before_angle);
      });

      it(`It's matrix is same with t1.matrix * t2.matrix * t3.matrix.`, function () {
        const list = $$getBaseTransformList($el);
        const m = go(
          rangeL(3),
          mapL((i) => list.getItem(i)),
          mapL(({ matrix: m }) => m),
          reduce((m1, m2) => m1.multiply(m2))
        );

        $$mergeRotateTransform()($el);

        expect($$getBaseTransformList($el).getItem(0).matrix).to.deep.equal(m);
      });
    });
  });
});
