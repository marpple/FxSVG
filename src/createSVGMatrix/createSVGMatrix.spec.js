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
import {
  makeAllCombinations,
  makeRandomNumber,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "./createSVGMatrix.index.js";

const expectSameMatrix = (
  m,
  { a = 1, b = 0, c = 0, d = 1, e = 0, f = 0 } = {}
) => {
  expect(m.a).to.equal(a);
  expect(m.b).to.equal(b);
  expect(m.c).to.equal(c);
  expect(m.d).to.equal(d);
  expect(m.e).to.equal(e);
  expect(m.f).to.equal(f);
};

const makeCases = () =>
  flatMapL(
    (f) =>
      go(
        ["a", "b", "c", "d", "e", "f"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomNumber()]),
            mapL((kv) => object([kv])),
            reduce(extend),
            defaultTo({})
          )
        ),
        mapL((values) => ({ values, matrix: f(values) })),
        appendL({ matrix: f() })
      ),
    [
      $$createSVGMatrix(),
      $$createSVGMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      ),
    ]
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

    it(`The matrix will be a identity matrix if there is no arguments.`, function () {
      const m1 = $$createSVGMatrix()();
      expectSameMatrix(m1, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });

      const m2 = $$createSVGMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )();
      expectSameMatrix(m2, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
    });

    it(`
  Each value of the matrix will be same with the given value.
  If there is omitted values, the values will be {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0} individually by default.
  `, function () {
      this.slow(100);
      each(
        ({ matrix, values }) => expectSameMatrix(matrix, values),
        makeCases()
      );
    });
  }),
];
