import { expect } from "chai";
import { equals2, go, go1, head, mapL, rangeL, reduce, rejectL } from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  makeRandomTransformAttributeValue,
  makeRandomSVGMatrix,
  makeRandomNumber,
  makeRandomInt,
  deepCopyTransformListToMatrixList,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$el } from "../el/el.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$initScaleTransform } from "../initScaleTransform/initScaleTransform.index.js";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";
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

const createMockElInitScaleTransform = (t) => {
  const $el = createMockEl(t);
  const init_index = makeRandomInt(
    0,
    $$getBaseTransformList($el).numberOfItems + 1
  );
  go(
    rangeL(4),
    mapL(() => makeRandomNumber()),
    ([cx, cy, sx, sy]) => ({ cx, cy, sx, sy, index: init_index }),
    (config) => $$initScaleTransform()($el, config)
  );
  return { $el, index: init_index + 1 };
};

describe(`$$mergeScaleTransform`, function () {
  describe(`
  If the input values failed to pass $$isValidFxScaleSVGTransformList, the function do nothing but return the element.
  `, function () {
    describe(`The input index should [0] < [index] < [SVGTransformList.numberOfItems - 1].`, function () {
      let $el;

      beforeEach(function () {
        $el = createMockEl(makeRandomTransformAttributeValue(10));
      });

      it(`If the input index [<=] 0.`, function () {
        const index = go1(makeRandomInt(), (n) => (n > 0 ? -n : n));

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`If the input index is [>=] SVGTransformList.numberOfItems - 1.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const index = makeRandomInt(
          transform_list.numberOfItems - 1,
          transform_list.numberOfItems + 1000
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });
    });

    describe(`The SVGTransform should be a valid type.`, function () {
      let $el;
      let index;

      beforeEach(function () {
        ({ $el, index } = createMockElInitScaleTransform(
          makeRandomTransformAttributeValue()
        ));
      });

      describe(`The SVGTransform at index - 1 should be a translate SVGTransform.`, function () {
        it(`If the SVGTransform at index - 1 is a matrix SVGTransform.`, function () {
          const matrix = makeRandomSVGMatrix();
          const matrix_t = $$createSVGTransformMatrix()({ matrix });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index - 1);
          transform_list.insertItemBefore(matrix_t, index - 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`If the SVGTransform at index - 1 is a rotate SVGTransform.`, function () {
          const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
          const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index - 1);
          transform_list.insertItemBefore(rotate_t, index - 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`If the SVGTransform at index - 1 is a scale SVGTransform.`, function () {
          const [sx, sy] = mapL(() => makeRandomNumber(), rangeL(2));
          const scale_t = $$createSVGTransformScale()({ sx, sy });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index - 1);
          transform_list.insertItemBefore(scale_t, index - 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });
      });

      describe(`The SVGTransform at index should be a scale SVGTransform.`, function () {
        it(`If the SVGTransform at index is a matrix SVGTransform.`, function () {
          const matrix = makeRandomSVGMatrix();
          const matrix_t = $$createSVGTransformMatrix()({ matrix });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index);
          transform_list.insertItemBefore(matrix_t, index);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`If the SVGTransform at index is a rotate SVGTransform.`, function () {
          const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
          const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index);
          transform_list.insertItemBefore(rotate_t, index);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`If the SVGTransform at index is a translate SVGTransform.`, function () {
          const [tx, ty] = mapL(() => makeRandomNumber(), rangeL(2));
          const translate_t = $$createSVGTransformTranslate()({ tx, ty });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index);
          transform_list.insertItemBefore(translate_t, index);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });
      });

      describe(`The SVGTransform at index + 1 should be a translate SVGTransform.`, function () {
        it(`If the SVGTransform at index + 1 is a matrix SVGTransform.`, function () {
          const matrix = makeRandomSVGMatrix();
          const matrix_t = $$createSVGTransformMatrix()({ matrix });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index + 1);
          transform_list.insertItemBefore(matrix_t, index + 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`If the SVGTransform at index + 1 is a rotate SVGTransform.`, function () {
          const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
          const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index + 1);
          transform_list.insertItemBefore(rotate_t, index + 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });

        it(`If the SVGTransform at index + 1 is a scale SVGTransform.`, function () {
          const [sx, sy] = mapL(() => makeRandomNumber(), rangeL(2));
          const scale_t = $$createSVGTransformScale()({ sx, sy });
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index + 1);
          transform_list.insertItemBefore(scale_t, index + 1);

          expectSameElementAndSameTransformListAfterMerge($el, { index });
        });
      });
    });

    describe(`The matrix of the SVGTransform at index - 1 should have the values ({a: 1, b: 0, c: 0, d: 1}).`, function () {
      let $el;
      let index;

      beforeEach(function () {
        ({ $el, index } = createMockElInitScaleTransform(
          makeRandomTransformAttributeValue()
        ));
      });

      it(`If the matrix's a value is not 1.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t = transform_list.getItem(index - 1);
        t.matrix.a = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(1)),
          head
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`If the matrix's b value is not 0.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t = transform_list.getItem(index - 1);
        t.matrix.b = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(0)),
          head
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`If the matrix's c value is not 0.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t = transform_list.getItem(index - 1);
        t.matrix.c = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(0)),
          head
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`If the matrix's d value is not 1.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t = transform_list.getItem(index - 1);
        t.matrix.d = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(1)),
          head
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });
    });

    describe(`The matrix of the SVGTransform at index + 1 should have the values ({a: 1, b: 0, c: 0, d: 1}).`, function () {
      let $el;
      let index;

      beforeEach(function () {
        ({ $el, index } = createMockElInitScaleTransform(
          makeRandomTransformAttributeValue()
        ));
      });

      it(`If the matrix's a value is not 1.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t = transform_list.getItem(index + 1);
        t.matrix.a = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(1)),
          head
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`If the matrix's b value is not 0.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t = transform_list.getItem(index + 1);
        t.matrix.b = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(0)),
          head
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`If the matrix's c value is not 0.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t = transform_list.getItem(index + 1);
        t.matrix.c = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(0)),
          head
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`If the matrix's d value is not 1.`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t = transform_list.getItem(index + 1);
        t.matrix.d = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(1)),
          head
        );

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });
    });

    describe(`The matrix at index -1 and the matrix at index + 1 should satisfy the following conditions.`, function () {
      let $el;
      let index;

      beforeEach(function () {
        ({ $el, index } = createMockElInitScaleTransform(
          makeRandomTransformAttributeValue()
        ));
      });

      it(`When t1 is the SVGMatrix at index - 1 and t3 is the SVGMatrix at index + 1, if not [t1.matrix.e + t3.matrix.e = 0].`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t1 = transform_list.getItem(index - 1);
        t1.matrix.e++;

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });

      it(`When t1 is the SVGMatrix at index - 1 and t3 is the SVGMatrix at index + 1, if not [t1.matrix.f + t3.matrix.f = 0].`, function () {
        const transform_list = $$getBaseTransformList($el);
        const t1 = transform_list.getItem(index - 1);
        t1.matrix.f++;

        expectSameElementAndSameTransformListAfterMerge($el, { index });
      });
    });
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
});
