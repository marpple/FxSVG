import { expect } from "chai";
import { makeAllCombinations } from "../../test/utils/index.js";
import { $$createSVGMatrix } from "./createSVGMatrix.index.js";

const expectSameMatrix = (
  m1,
  { a = 1, b = 0, c = 0, d = 1, e = 0, f = 0 } = {}
) => {
  expect(m1.a).to.equal(a);
  expect(m1.b).to.equal(b);
  expect(m1.c).to.equal(c);
  expect(m1.d).to.equal(d);
  expect(m1.e).to.equal(e);
  expect(m1.f).to.equal(f);
};

const makeRandomNumber = () => {
  const n = Math.random() * 1000;
  return Math.round(Math.random()) ? n : -n;
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
