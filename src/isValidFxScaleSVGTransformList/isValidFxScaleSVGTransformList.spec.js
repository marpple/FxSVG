import { expect } from "chai";
import {
  concatL,
  equals2,
  extend,
  flatMapL,
  go,
  go1,
  join,
  mapL,
  rangeL,
  reduce,
  rejectL,
  tap,
} from "fxjs2";
import {
  makeMockRectInitiatedScaleTransform,
  makeRandomBool,
  makeRandomInt,
  makeRandomNumber,
  makeRandomNumberExcept,
  makeRandomSVGTransformMatrix,
  makeRandomSVGTransformRotate,
  makeRandomSVGTransformScale,
  makeRandomSVGTransformTranslate,
  makeRandomTransformAttributeValue,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$getBaseTransformList } from "../getBaseTransformList/getBaseTransformList.index.js";
import { $$isValidFxScaleSVGTransformList } from "./isValidFxScaleSVGTransformList.index.js";

export const makeInvalidIndexCases = () =>
  go(
    rangeL(2),
    mapL(() => makeRandomTransformAttributeValue(10)),
    mapL((transform) => makeMockRectInitiatedScaleTransform({ transform })),
    ([mock1, mock2]) => [
      go(
        makeRandomInt(),
        (n) => (n > 0 ? -n : n),
        (index) => extend(mock1, { description: `index <= 0`, index })
      ),
      go(
        mock2,
        ({ $el }) => $el,
        $$getBaseTransformList,
        ({ numberOfItems: n }) => n,
        (n) => [n - 1, n + 1000],
        ([min, max]) => makeRandomInt(min, max),
        (index) =>
          extend(mock2, {
            description: `index >= SVGTransformList.numberOfItems - 1`,
            index,
          })
      ),
    ]
  );

export const makeInvalidSVGTransformTypeCases = () => {
  const matrix_transform = makeRandomSVGTransformMatrix();
  const translate_transform = makeRandomSVGTransformTranslate();
  const scale_transform = makeRandomSVGTransformScale();
  const rotate_transform = makeRandomSVGTransformRotate();
  const skewx_transform = go1(
    $$createSVGTransform(),
    tap((transform) => transform.setSkewX(makeRandomNumber(-700, 700)))
  );
  const skewy_transform = go1(
    $$createSVGTransform(),
    tap((transform) => transform.setSkewY(makeRandomNumber(-700, 700)))
  );
  const transform_list = [
    { name: `matrix`, transform: matrix_transform },
    { name: `translate`, transform: translate_transform },
    { name: `scale`, transform: scale_transform },
    { name: `rotate`, transform: rotate_transform },
    { name: `skewX`, transform: skewx_transform },
    { name: `skewY`, transform: skewy_transform },
  ];

  const invalid_scale_transform_cases = go(
    transform_list,
    rejectL(({ name }) => equals2(name, "scale")),
    (invalid_transforms) => ({
      name: `scale`,
      index_delta: 0,
      invalid_transforms,
    })
  );
  const invalid_translate_transform_cases = go1(
    [-1, 1],
    flatMapL((index_delta) =>
      go(
        transform_list,
        rejectL(({ name }) => equals2(name, "translate")),
        (invalid_transforms) => ({
          name: `translate`,
          index_delta,
          invalid_transforms,
        })
      )
    )
  );

  return go(
    [invalid_scale_transform_cases, ...invalid_translate_transform_cases],
    flatMapL(({ name: name_expect, index_delta, invalid_transforms }) =>
      mapL(
        ({ name: name_receive, transform }) => ({
          name_expect,
          name_receive,
          index_delta,
          transform,
        }),
        invalid_transforms
      )
    ),
    mapL(({ name_expect, name_receive, index_delta, transform }) =>
      go(
        makeMockRectInitiatedScaleTransform(),
        tap(({ $el, index }) => {
          const transform_list = $$getBaseTransformList($el);
          transform_list.removeItem(index + index_delta);
          transform_list.insertItemBefore(transform, index + index_delta);
        }),
        (mock) => ({
          mock,
          description: { name_expect, name_receive, index_delta },
        })
      )
    ),
    mapL(({ mock, description: { name_expect, name_receive, index_delta } }) =>
      go(
        index_delta,
        (index_delta) => {
          if (index_delta > 0) {
            return `i + ${Math.abs(index_delta)}`;
          }

          if (index_delta < 0) {
            return `i - ${Math.abs(index_delta)}`;
          }

          return "i";
        },
        (name_index) =>
          `index : ${name_index}, expect : ${name_expect} receive : ${name_receive}`,
        (description) => extend(mock, { description })
      )
    )
  );
};

export const makeInvalidSVGMatrixValueCases = () => {
  const iter1 = go(
    [-1, 1],
    flatMapL((index_delta) =>
      go1(
        [
          { expect_value: 1, keys: ["a", "d"] },
          { expect_value: 0, keys: ["b", "c"] },
        ],
        flatMapL(({ expect_value, keys }) =>
          mapL((key) => ({ key, expect_value, index_delta }), keys)
        )
      )
    ),
    mapL(({ index_delta, key, expect_value }) => {
      const mock = makeMockRectInitiatedScaleTransform();
      const { $el, index } = mock;
      const receive_value = makeRandomNumberExcept(-100, 100, [expect_value]);
      go1(
        $$getBaseTransformList($el).getItem(index + index_delta),
        ({ matrix }) => (matrix[key] = receive_value)
      );
      return {
        mock,
        description: { index_delta, key, expect_value, receive_value },
      };
    }),
    mapL(
      ({
        mock,
        description: { index_delta, key, expect_value, receive_value },
      }) =>
        go(
          index_delta,
          (index_delta) =>
            index_delta > 0 ? `i + ${index_delta}` : `i - ${-index_delta}`,
          (name_index) =>
            `eval : transforms[${name_index}]["matrix"]["${key}"], expect : ${expect_value}, receive : ${receive_value}`,
          (description) => extend(mock, { description })
        )
    )
  );
  const iter2 = go(
    ["e", "f"],
    mapL((key) => ({ key, expect_value: 0 })),
    mapL(({ key, expect_value }) => {
      const mock = makeMockRectInitiatedScaleTransform();
      const { $el, index } = mock;
      const receive_value = makeRandomNumberExcept(-100, 100, [0]);
      go(
        makeRandomBool() ? -1 : 1,
        (index_delta) => index + index_delta,
        (i) => $$getBaseTransformList($el).getItem(i),
        ({ matrix }) => (matrix[key] += receive_value)
      );
      return { mock, description: { key, expect_value, receive_value } };
    }),
    mapL(({ mock, description: { key, expect_value, receive_value } }) =>
      go(
        [
          `eval : transforms[i - 1]["matrix"]["${key}"] + transforms[i + 1]["matrix"]["${key}"]`,
          `expect : ${expect_value}`,
          `receive : ${receive_value}`,
        ],
        join(", "),
        (description) => extend(mock, { description })
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
    it(`The function returns true in other cases not in false cases below.`, function () {
      const { $el, index } = makeMockRectInitiatedScaleTransform();
      const transform_list = $$getBaseTransformList($el);

      const is_valid = $$isValidFxScaleSVGTransformList({ index })(
        transform_list
      );

      expect(is_valid).true;
    });

    it(`The function returns false when the input index is out of bounds.`, function () {
      for (const { description, $el, index } of makeInvalidIndexCases()) {
        const transform_list = $$getBaseTransformList($el);

        const is_valid = $$isValidFxScaleSVGTransformList({ index })(
          transform_list
        );

        expect(is_valid, description).false;
      }
    });

    it(`The function returns false when the transforms
        whose index is from input index - 1 to input index + 1 have invalid type.`, function () {
      const cases = makeInvalidSVGTransformTypeCases();
      for (const { description, $el, index } of cases) {
        const transform_list = $$getBaseTransformList($el);

        const is_valid = $$isValidFxScaleSVGTransformList({ index })(
          transform_list
        );

        expect(is_valid, description).false;
      }
    });

    it(`The function returns false when the transforms
        whose index is from input index - 1 to input index + 1 have invalid matrix.`, function () {
      const cases = makeInvalidSVGMatrixValueCases();
      for (const { description, $el, index } of cases) {
        const transform_list = $$getBaseTransformList($el);

        const is_valid = $$isValidFxScaleSVGTransformList({ index })(
          transform_list
        );

        expect(is_valid, description).false;
      }
    });
  }),
];
