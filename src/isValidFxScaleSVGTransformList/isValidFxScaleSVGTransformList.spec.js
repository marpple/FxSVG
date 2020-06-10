import { expect } from "chai";
import {
  concatL,
  each,
  flatMapL,
  go,
  join,
  mapL,
  rangeL,
  reduce,
  tap,
} from "fxjs2";
import {
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
      makeMockRectInitiatedScaleTransform({
        transform: makeRandomTransformAttributeValue(10),
      })
    ),
    mapL(({ $el }) => $el),
    ([$el1, $el2]) => [
      go(
        makeRandomInt(),
        (n) => (n > 0 ? -n : n),
        (i) => [`index <= 0`, $el1, i]
      ),
      go(
        $el2,
        $$getBaseTransformList,
        ({ numberOfItems: n }) => n,
        (n) => [n - 1, n + 1000],
        ([min, max]) => makeRandomInt(min, max),
        (i) => [`index >= SVGTransformList.numberOfItems - 1`, $el2, i]
      ),
    ]
  );

export const makeInvalidSVGTransformTypeCases = () =>
  go(
    [
      [
        `translate`,
        -1,
        [
          [`matrix`, makeRandomSVGTransformMatrix()],
          [`rotate`, makeRandomSVGTransformRotate()],
          [`scale`, makeRandomSVGTransformScale()],
        ],
      ],
      [
        `scale`,
        0,
        [
          [`matrix`, makeRandomSVGTransformMatrix()],
          [`rotate`, makeRandomSVGTransformRotate()],
          [`translate`, makeRandomSVGTransformTranslate()],
        ],
      ],
      [
        `translate`,
        1,
        [
          [`matrix`, makeRandomSVGTransformMatrix()],
          [`rotate`, makeRandomSVGTransformRotate()],
          [`scale`, makeRandomSVGTransformScale()],
        ],
      ],
    ],
    flatMapL(([title_expect, index_delta, transforms]) =>
      mapL(
        ([title_receive, t]) => [title_expect, title_receive, index_delta, t],
        transforms
      )
    ),
    mapL(([title_expect, title_receive, index_delta, t]) =>
      go(
        makeMockRectInitiatedScaleTransform(),
        tap(({ $el, index }) => {
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index + index_delta);
          transform_list.insertItemBefore(t, index + index_delta);
        }),
        ({ $el, index }) => [
          title_expect,
          title_receive,
          index_delta,
          $el,
          index,
        ]
      )
    ),
    mapL(([title_expect, title_receive, index_delta, $el, index]) =>
      go(
        index_delta,
        (index_delta) => {
          if (index_delta > 0) return `+${index_delta}`;
          if (index_delta < 0) return `${index_delta}`;
          return "";
        },
        (s) => `i${s}`,
        (title_index) => [
          `index=${title_index}`,
          `expect=${title_expect}`,
          `receive=${title_receive}`,
        ],
        join("::"),
        (title) => [title, $el, index]
      )
    )
  );

export const makeInvalidSVGMatrixValueCases = () => {
  const iter1 = go(
    rangeL(-1, 2, 2),
    flatMapL((index_delta) =>
      mapL(([k, expect_value]) => [index_delta, k, expect_value], [
        ["a", 1],
        ["b", 0],
        ["c", 0],
        ["d", 1],
      ])
    ),
    mapL(([index_delta, k, expect_value]) => {
      const { $el, index } = makeMockRectInitiatedScaleTransform();
      const receive_value = makeRandomNumberExcept(-100, 100, [expect_value]);
      const { matrix } = $$getBaseTransformList($el).getItem(
        index + index_delta
      );
      matrix[k] = receive_value;
      return [index_delta, k, expect_value, receive_value, $el, index];
    }),
    mapL(([index_delta, k, expect_value, receive_value, $el, index]) =>
      go(
        index_delta,
        (index_delta) =>
          index_delta > 0 ? `+${index_delta}` : `${index_delta}`,
        (title_index) => [
          `index=${title_index}`,
          `key=${k}`,
          `expect=${expect_value}`,
          `receive=${receive_value}`,
        ],
        join("::"),
        (title) => [title, $el, index]
      )
    )
  );
  const iter2 = go(
    [
      ["e", 0],
      ["f", 0],
    ],
    mapL(([k, expect_value]) => {
      const { $el, index } = makeMockRectInitiatedScaleTransform();
      const index_delta = makeRandomBool() ? -1 : 1;
      const receive_value = makeRandomNumberExcept(-100, 100, [0]);
      const { matrix } = $$getBaseTransformList($el).getItem(
        index + index_delta
      );
      matrix[k] += receive_value;
      return [k, expect_value, receive_value, $el, index];
    }),
    mapL(([k, expect_value, receive_value, $el, index]) =>
      go(
        [
          `expresion=(i-1).matrix.${k}+(i+1).matrix.${k}`,
          `expect=${expect_value}`,
          `receive=${receive_value}`,
        ],
        join("::"),
        (title) => [title, $el, index]
      )
    )
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

    go(
      [
        [
          `The input index should [0 < index < SVGTransformList.numberOfItems - 1].`,
          makeInvalidIndexCases,
        ],
        [
          `The SVGTransform should be a valid type.`,
          makeInvalidSVGTransformTypeCases,
        ],
        [
          `The SVGMatrix values should be valid.`,
          makeInvalidSVGMatrixValueCases,
        ],
      ],
      mapL(([title, makeInvalidCases]) =>
        go(
          makeInvalidCases(),
          mapL(([title, $el, index]) =>
            go(
              $el,
              $$getBaseTransformList,
              (transform_list) =>
                $$isValidFxScaleSVGTransformList(transform_list, { index }),
              (result) => [
                `If [${title}], the function will return false.`,
                function () {
                  expect(result).to.be.false;
                },
              ]
            )
          ),
          (iter) =>
            function () {
              each(([title, f]) => it(title, f), iter);
            },
          (f) => [title, f]
        )
      ),
      each(([title, f]) => describe(title, f))
    );
  }),
];
