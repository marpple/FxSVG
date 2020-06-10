import { expect } from "chai";
import {
  appendL,
  concatL,
  each,
  flatMapL,
  go,
  go1,
  mapL,
  pipe,
  rangeL,
  reduce,
} from "fxjs2";
import {
  makeMockRect,
  makeMockRectInitiatedScaleTransform,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumberExcept,
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

export const makeInvalidSVGMatrixValueCases = () => {
  const iter1 = go(
    rangeL(-1, 2, 2),
    mapL((index_delta) => [
      `i${index_delta > 0 ? `+${index_delta}` : `${index_delta}`}`,
      index_delta,
    ]),
    flatMapL(([title_index, index_delta]) =>
      mapL(
        ([k, expect_value]) =>
          go1(makeMockRectInitiatedScaleTransform(), ({ $el, index }) => {
            const receive_value = makeRandomNumberExcept(-100, 100, [
              expect_value,
            ]);
            $$getBaseTransformList($el).getItem(index + index_delta).matrix[
              k
            ] = receive_value;
            return [
              `index=${title_index}::key=${k}::expect=${expect_value}::receive=${receive_value}`,
              $el,
              index,
            ];
          }),
        [
          ["a", 1],
          ["b", 0],
          ["c", 0],
          ["d", 1],
        ]
      )
    )
  );
  const iter2 = go(
    [
      ["e", 0],
      ["f", 0],
    ],
    mapL(appendL(makeMockRectInitiatedScaleTransform())),
    mapL(appendL(makeRandomBool() ? -1 : 1)),
    mapL(appendL(makeRandomNumberExcept(-100, 100, [0]))),
    mapL(([k, expect_value, { $el, index }, index_delta, receive_value]) => {
      const l = $$getBaseTransformList($el);
      const t = l.getItem(index + index_delta);
      t.matrix[k] += receive_value;
      return [
        `expresion=(i-1).matrix.${k}+(i+1).matrix.${k}::expect=${expect_value}::receive=${receive_value}`,
        $el,
        index,
      ];
    })
  );

  return concatL(iter1, iter2);
};

export const makeInvalidCases = () =>
  go(
    [
      makeInvalidIndexCases,
      makeInvalidSVGTransformTypeCases,
      makeInvalidSVGMatrixValueCases,
    ],
    mapL((f) => f()),
    reduce(concatL)
  );

const runInvalidTestCases = (it) =>
  pipe(
    mapL(([title, $el, index]) =>
      go(
        $el,
        $$getBaseTransformList,
        (transform_list) =>
          $$isValidFxScaleSVGTransformList(transform_list, { index }),
        (result) => [title, result]
      )
    ),
    each(([title, result]) =>
      it(title, function () {
        expect(result).to.be.false;
      })
    )
  );

export default ({ describe, it }) => [
  describe(`$$isValidFxScaleSVGTransformList`, function () {
    it(`In other cases not in false cases below, the function will return true`, function () {
      const { $el, index } = makeMockRectInitiatedScaleTransform();
      const transform_list = $$getBaseTransformList($el);

      const result = $$isValidFxScaleSVGTransformList(transform_list, {
        index,
      });
      expect(result).to.be.true;
    });

    describe(`The input index should [0 < index < SVGTransformList.numberOfItems - 1].`, function () {
      go(
        makeInvalidIndexCases(),
        mapL(([title, $el, index]) => [
          `If [${title}], the function will return false.`,
          $el,
          index,
        ]),
        runInvalidTestCases(it)
      );
    });

    describe(`The SVGTransform should be a valid type.`, function () {
      go(
        makeInvalidSVGTransformTypeCases(),
        mapL(([title, $el, index]) => [
          `If [${title}], the function will return false.`,
          $el,
          index,
        ]),
        runInvalidTestCases(it)
      );
    });

    describe(`The SVGMatrix values should be valid.`, function () {
      go(
        makeInvalidSVGMatrixValueCases(),
        mapL(([title, $el, index]) => [
          `If [${title}], the function will return false`,
          $el,
          index,
        ]),
        runInvalidTestCases(it)
      );
    });
  }),
];
