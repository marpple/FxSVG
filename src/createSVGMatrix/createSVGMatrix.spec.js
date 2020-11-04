import chai from "chai";
import { appendL, defaultTo, extend, flatMapL, go, mapL, object } from "fxjs";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGMatrix } from "./createSVGMatrix.index.js";

const { expect } = chai;

const makeCases = () =>
  go(
    ["a", "b", "c", "d", "e", "f"],
    makeAllCombinations,
    mapL(mapL((k) => [k, makeRandomInt(-100, 100)])),
    mapL(object),
    mapL((values) => ({ values, f: $$createSVGMatrix(values) })),
    appendL({ f: $$createSVGMatrix() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, matrix: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGMatrix`, function () {
    it(`The return value is a SVGMatrix.`, function () {
      for (const { matrix } of makeCases()) {
        expect(matrix).instanceof(SVGMatrix);
      }
    });

    it(`Each value of the matrix will be same with the given value.
        If there is omitted values or no argument,
        the values will be {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0} individually by default.`, function () {
      this.slow(100);

      for (const { matrix, values } of makeCases()) {
        const expect_values = extend(
          { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
          defaultTo({}, values)
        );
        expectSameValueSVGMatrix(matrix, expect_values);
      }
    });
  }),
];
