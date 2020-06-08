import { expect } from "chai";
import { equals2, go, go1, head, mapL, rangeL, rejectL } from "fxjs2";
import {
  makeMockRect,
  makeMockRectInitiatedScaleTransform,
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isValidFxScaleSVGTransformList } from "./isValidFxScaleSVGTransformList.index.js";

export default () => [
  describe(`$$isValidFxScaleSVGTransformList`, function () {
    it(`In other cases not in false cases below, the function will return true`, function () {
      const { $el, index } = makeMockRectInitiatedScaleTransform();
      const transform_list = $$getBaseTransformList($el);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index,
      });
      expect(result).to.be.true;
    });

    describe(`The input index should [0] < [index] < [SVGTransformList.numberOfItems - 1].`, function () {
      let transform_list;

      beforeEach(function () {
        const $el = makeMockRect({
          transform: makeRandomTransformAttributeValue(10),
        });
        transform_list = $$getBaseTransformList($el);
      });

      it(`If the input index [<=] 0, the function will return false.`, function () {
        const index = go1(makeRandomInt(), (n) => (n > 0 ? -n : n));

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });

      it(`If the input index is [>=] SVGTransformList.numberOfItems - 1, the function will return false.`, function () {
        const index = makeRandomInt(
          transform_list.numberOfItems - 1,
          transform_list.numberOfItems + 1000
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });
    });

    describe(`The SVGTransform should be a valid type.`, function () {
      let transform_list;
      let index;

      beforeEach(function () {
        const { $el, index: _index } = makeMockRectInitiatedScaleTransform();
        transform_list = $$getBaseTransformList($el);
        index = _index;
      });

      describe(`The SVGTransform at index - 1 should be a translate SVGTransform.`, function () {
        it(`If the SVGTransform at index - 1 is a matrix SVGTransform, the function will return false.`, function () {
          const matrix = makeRandomSVGMatrix();
          const matrix_t = $$createSVGTransformMatrix()({ matrix });
          transform_list.removeItem(index - 1);
          transform_list.insertItemBefore(matrix_t, index - 1);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });

        it(`If the SVGTransform at index - 1 is a rotate SVGTransform, the function will return false.`, function () {
          const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
          const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
          transform_list.removeItem(index - 1);
          transform_list.insertItemBefore(rotate_t, index - 1);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });

        it(`If the SVGTransform at index - 1 is a scale SVGTransform, the function will return false.`, function () {
          const [sx, sy] = mapL(() => makeRandomNumber(), rangeL(2));
          const scale_t = $$createSVGTransformScale()({ sx, sy });
          transform_list.removeItem(index - 1);
          transform_list.insertItemBefore(scale_t, index - 1);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });
      });

      describe(`The SVGTransform at index should be a scale SVGTransform.`, function () {
        it(`If the SVGTransform at index is a matrix SVGTransform, the function will return false.`, function () {
          const matrix = makeRandomSVGMatrix();
          const matrix_t = $$createSVGTransformMatrix()({ matrix });
          transform_list.removeItem(index);
          transform_list.insertItemBefore(matrix_t, index);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });

        it(`If the SVGTransform at index is a rotate SVGTransform, the function will return false.`, function () {
          const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
          const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
          transform_list.removeItem(index);
          transform_list.insertItemBefore(rotate_t, index);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });

        it(`If the SVGTransform at index is a translate SVGTransform, the function will return false.`, function () {
          const [tx, ty] = mapL(() => makeRandomNumber(), rangeL(2));
          const translate_t = $$createSVGTransformTranslate()({ tx, ty });
          transform_list.removeItem(index);
          transform_list.insertItemBefore(translate_t, index);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });
      });

      describe(`The SVGTransform at index + 1 should be a translate SVGTransform.`, function () {
        it(`If the SVGTransform at index + 1 is a matrix SVGTransform, the function will return false.`, function () {
          const matrix = makeRandomSVGMatrix();
          const matrix_t = $$createSVGTransformMatrix()({ matrix });
          transform_list.removeItem(index + 1);
          transform_list.insertItemBefore(matrix_t, index + 1);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });

        it(`If the SVGTransform at index + 1 is a rotate SVGTransform, the function will return false.`, function () {
          const [angle, cx, cy] = mapL(() => makeRandomNumber(), rangeL(3));
          const rotate_t = $$createSVGTransformRotate()({ angle, cx, cy });
          transform_list.removeItem(index + 1);
          transform_list.insertItemBefore(rotate_t, index + 1);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });

        it(`If the SVGTransform at index + 1 is a scale SVGTransform, the function will return false.`, function () {
          const [sx, sy] = mapL(() => makeRandomNumber(), rangeL(2));
          const scale_t = $$createSVGTransformScale()({ sx, sy });
          transform_list.removeItem(index + 1);
          transform_list.insertItemBefore(scale_t, index + 1);

          const result = $$isValidFxScaleSVGTransformList(transform_list, {
            index,
          });
          expect(result).to.be.false;
        });
      });
    });

    describe(`The matrix of the SVGTransform at index - 1 should have the values ({a: 1, b: 0, c: 0, d: 1}).`, function () {
      let transform_list;
      let index;

      beforeEach(function () {
        const { $el, index: _index } = makeMockRectInitiatedScaleTransform();
        transform_list = $$getBaseTransformList($el);
        index = _index;
      });

      it(`If the matrix's a value is not 1, the function will return false.`, function () {
        const t = transform_list.getItem(index - 1);
        t.matrix.a = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(1)),
          head
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });

      it(`If the matrix's b value is not 0, the function will return false.`, function () {
        const t = transform_list.getItem(index - 1);
        t.matrix.b = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(0)),
          head
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });

      it(`If the matrix's c value is not 0, the function will return false.`, function () {
        const t = transform_list.getItem(index - 1);
        t.matrix.c = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(0)),
          head
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });

      it(`If the matrix's d value is not 1, the function will return false.`, function () {
        const t = transform_list.getItem(index - 1);
        t.matrix.d = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(1)),
          head
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });
    });

    describe(`The matrix of the SVGTransform at index + 1 should have the values ({a: 1, b: 0, c: 0, d: 1}).`, function () {
      let transform_list;
      let index;

      beforeEach(function () {
        const { $el, index: _index } = makeMockRectInitiatedScaleTransform();
        transform_list = $$getBaseTransformList($el);
        index = _index;
      });

      it(`If the matrix's a value is not 1, the function will return false.`, function () {
        const t = transform_list.getItem(index + 1);
        t.matrix.a = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(1)),
          head
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });

      it(`If the matrix's b value is not 0, the function will return false.`, function () {
        const t = transform_list.getItem(index + 1);
        t.matrix.b = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(0)),
          head
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });

      it(`If the matrix's c value is not 0, the function will return false.`, function () {
        const t = transform_list.getItem(index + 1);
        t.matrix.c = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(0)),
          head
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });

      it(`If the matrix's d value is not 1, the function will return false.`, function () {
        const t = transform_list.getItem(index + 1);
        t.matrix.d = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          rejectL(equals2(1)),
          head
        );

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });
    });

    describe(`The matrix at index -1 and the matrix at index + 1 should satisfy the following conditions.`, function () {
      let transform_list;
      let index;

      beforeEach(function () {
        const { $el, index: _index } = makeMockRectInitiatedScaleTransform();
        transform_list = $$getBaseTransformList($el);
        index = _index;
      });

      it(`
    When t1 is the SVGMatrix at index - 1 and t3 is the SVGMatrix at index + 1,
    if not [t1.matrix.e + t3.matrix.e = 0], the function will return false.
    `, function () {
        const t1 = transform_list.getItem(index - 1);
        t1.matrix.e++;

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });

      it(`
    When t1 is the SVGMatrix at index - 1 and t3 is the SVGMatrix at index + 1,
    if not [t1.matrix.f + t3.matrix.f = 0], the function will return false.
    `, function () {
        const t1 = transform_list.getItem(index - 1);
        t1.matrix.f++;

        const result = $$isValidFxScaleSVGTransformList(transform_list, {
          index,
        });
        expect(result).to.be.false;
      });
    });
  }),
];
