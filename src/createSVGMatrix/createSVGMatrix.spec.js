import { expect } from "chai";
import {
  appendL,
  defaultTo,
  each,
  extend,
  flatMapL,
  go,
  mapL,
  object,
  pipe,
  reduce,
} from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import {
  $$createSVGMatrix,
  $$createSVGMatrix2,
  $$createSVGMatrix3,
} from "./createSVGMatrix.index.js";

const makeCases = () =>
  flatMapL(
    ($svg) =>
      go(
        ["a", "b", "c", "d", "e", "f"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomInt(-100, 100)]),
            mapL((kv) => object([kv])),
            reduce(extend),
            defaultTo({})
          )
        ),
        flatMapL((values) =>
          mapL((matrix) => ({ values, matrix }), [
            $$createSVGMatrix($svg)(values),
            $$createSVGMatrix2(values)($svg),
            $$createSVGMatrix3(values, $svg),
          ])
        ),
        appendL({ matrix: $$createSVGMatrix($svg)() }),
        appendL({ matrix: $$createSVGMatrix2()($svg) }),
        appendL({ matrix: $$createSVGMatrix3(undefined, $svg) })
        // $$createSVGMatrix3() -> option, $svg 모두 기본값 사용시
      ),
    [undefined, document.createElementNS("http://www.w3.org/2000/svg", "svg")]
  );

export default ({ describe, it }) => [
  describe(`$$createSVGMatrix`, function () {
    it(`The return value is a SVGMatrix.`, function () {
      go(
        makeCases(),
        mapL(({ matrix: m }) => m),
        each((m) => expect(m).to.instanceof(SVGMatrix))
      );
    });

    it(`Each value of the matrix will be same with the given value.
        If there is omitted values or no argument,
        the values will be {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0} individually by default.`, function () {
      this.slow(100);
      go(
        makeCases(),
        mapL(({ matrix, values }) =>
          go(
            values,
            defaultTo({}),
            (values) => extend({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }, values),
            (values) => ({ matrix, values })
          )
        ),
        each(({ matrix, values }) => expectSameValueSVGMatrix(matrix, values))
      );
    });
  }),
];
