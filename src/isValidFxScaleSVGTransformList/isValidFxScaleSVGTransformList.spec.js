import { expect } from "chai";
import {
  each,
  equals2,
  flatMapL,
  go,
  go1,
  head,
  mapL,
  rangeL,
  rejectL,
} from "fxjs2";
import {
  makeMockRect,
  makeMockRectInitiatedScaleTransform,
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGTransformMatrix,
  makeRandomSVGTransformRotate,
  makeRandomSVGTransformScale,
  makeRandomSVGTransformTranslate,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isValidFxScaleSVGTransformList } from "./isValidFxScaleSVGTransformList.index.js";

export const makeInvalidIndexCases = () =>
  go(
    rangeL(2),
    mapL(() =>
      makeMockRect({ transform: makeRandomTransformAttributeValue(10) })
    ),
    ([$el1, $el2]) => [
      ["index <= 0", $el1, go1(makeRandomInt(), (n) => (n > 0 ? -n : n))],
      [
        "index >= SVGTransformList.numberOfItems - 1",
        $el2,
        go1($$getBaseTransformList($el2), (transform_list) =>
          makeRandomInt(
            transform_list.numberOfItems - 1,
            transform_list.numberOfItems + 1000
          )
        ),
      ],
    ]
  );

export const makeInvalidSVGTransformTypeCases = () =>
  flatMapL(
    ([[title_index, title_expect], index_delta, transforms]) =>
      mapL(
        ([title_receive, t]) =>
          go1(makeMockRectInitiatedScaleTransform(), ({ $el, index }) => {
            const transform_list = $$getBaseTransformList($el);
            transform_list.removeItem(index + index_delta);
            transform_list.insertItemBefore(t, index + index_delta);
            return [
              `index=${title_index}::expect=${title_expect}::receive=${title_receive}`,
              $el,
              index,
            ];
          }),
        transforms
      ),
    [
      [
        [`i-1`, `translate`],
        -1,
        [
          [`matrix`, makeRandomSVGTransformMatrix()],
          [`rotate`, makeRandomSVGTransformRotate()],
          [`scale`, makeRandomSVGTransformScale()],
        ],
      ],
      [
        [`i`, `scale`],
        0,
        [
          [`matrix`, makeRandomSVGTransformMatrix()],
          [`rotate`, makeRandomSVGTransformRotate()],
          [`translate`, makeRandomSVGTransformTranslate()],
        ],
      ],
      [
        [`i+1`, `translate`],
        1,
        [
          [`matrix`, makeRandomSVGTransformMatrix()],
          [`rotate`, makeRandomSVGTransformRotate()],
          [`scale`, makeRandomSVGTransformScale()],
        ],
      ],
    ]
  );

export default ({ describe, it, beforeEach }) => [
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
      go(
        makeInvalidIndexCases(),
        mapL(([title, $el, index]) => [
          `If [${title}], the function will return false.`,
          $$getBaseTransformList($el),
          index,
        ]),
        each(([title, transform_list, index]) =>
          it(title, function () {
            const result = $$isValidFxScaleSVGTransformList(transform_list, {
              index,
            });
            expect(result).to.be.false;
          })
        )
      );
    });

    describe(`The SVGTransform should be a valid type.`, function () {
      go(
        makeInvalidSVGTransformTypeCases(),
        mapL(([title, $el, index]) => [
          `If [${title}], the function will return false.`,
          $$getBaseTransformList($el),
          index,
        ]),
        each(([title, transform_list, index]) =>
          it(title, function () {
            const result = $$isValidFxScaleSVGTransformList(transform_list, {
              index,
            });
            expect(result).to.be.false;
          })
        )
      );
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
