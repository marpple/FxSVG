import chai from "chai";
import { each, filterL, go, mapL, object } from "fxjs2";
import { makeAllCombinations } from "../../test/utils/makeAllCombinations.js";
import { makeRandomNumberExcept } from "../../test/utils/makeRandomNumberExcept.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$isIdentityMatrix } from "./isIdentityMatrix.index.js";

const { expect } = chai;

export default ({ describe, it }) => [
  describe(`$$isIdentityMatrix`, function () {
    it(`The function returns "true" if the input matrix is an identity matrix.`, function () {
      // given
      const matrix = $$createSVGMatrix({
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0,
      })();

      // when
      const result = $$isIdentityMatrix(matrix);

      // then
      expect(result).true;
    });

    it(`The function returns "true" if the input matrix is almost an identity matrix.
        The function ignores difference within the "Number.EPSILON" range.`, function () {
      // given
      const a = 1 + Number.EPSILON / 2;
      const b = 0 - Number.EPSILON / 2;
      const c = 0 + Number.EPSILON / 2;
      const d = 1 - Number.EPSILON / 2;
      const e = 0 + Number.EPSILON / 2;
      const f = 0 - Number.EPSILON / 2;
      const matrix = $$createSVGMatrix({ a, b, c, d, e, f })();

      // when
      const result = $$isIdentityMatrix(matrix);

      // then
      expect(result).true;
    });

    it(`The function returns "false" if the input matrix is not an identity matrix and even not close to it.
        (out of the range of "Number.EPSILON")`, function () {
      // given
      const cases = go(
        [
          ["a", 1],
          ["b", 0],
          ["c", 0],
          ["d", 1],
          ["e", 0],
          ["f", 0],
        ],
        makeAllCombinations,
        filterL((l) => l.length),
        mapL(
          mapL(([name, expect_num]) => [
            name,
            makeRandomNumberExcept(-10, 10, [expect_num]),
          ])
        ),
        mapL(mapL(([name, num]) => [name, num + Number.EPSILON])),
        mapL(object),
        mapL((o) => $$createSVGMatrix(o)())
      );

      // when
      const result_list = mapL($$isIdentityMatrix, cases);

      // then
      each((result) => expect(result).false, result_list);
    });
  }),
];
