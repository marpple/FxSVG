import { expect } from "chai";
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

const makeCases = () => {
  const makeSubCases = () => [
    ...makeAllCombinations(["a", "b", "c", "d", "e", "f"]).map((ks) =>
      ks
        .map((k) => [k, makeRandomNumber()])
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {})
    ),
    {},
  ];
  return [
    { matrix: $$createSVGMatrix()() },
    ...makeSubCases().map((values) => ({
      values,
      matrix: $$createSVGMatrix()(values),
    })),
    {
      matrix: $$createSVGMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    },
    ...makeSubCases().map((values) => ({
      values,
      matrix: $$createSVGMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(values),
    })),
  ];
};

describe(`$$createSVGMatrix`, function () {
  it(`The return value is a SVGMatrix.`, function () {
    const cases = makeCases();
    for (const { matrix } of cases) {
      expect(matrix).to.instanceof(SVGMatrix);
    }
  });

  it(`The matrix will be a identity matrix if there is no arguments.`, function () {
    const $svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    const m1 = $$createSVGMatrix()();
    expectSameMatrix(m1, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });

    const m2 = $$createSVGMatrix($svg)();
    expectSameMatrix(m2, { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  });

  it(`
  Each value of the matrix will be same with the given value.
  If there is omitted values, the values will be {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0} individually by default.
  `, function () {
    const cases = makeCases();
    for (const { matrix, values } of cases) {
      expectSameMatrix(matrix, values);
    }
  });
});
