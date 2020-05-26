import { expect } from "chai";
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

const makeMatrixValues = () =>
  [...Array(5000)]
    .map(() =>
      ["a", "b", "c", "d", "e", "f"]
        .map((k) => [k, Math.round(Math.random()) === 1])
        .map(([k, exist]) => [k, exist ? makeRandomNumber() : null])
    )
    .map((kvs) =>
      kvs.reduce((m, [k, v]) => {
        if (v == null) {
          return m;
        }
        m[k] = v;
        return m;
      }, {})
    );

const makeTests = () => [
  ...makeMatrixValues()
    .map((values) => ({ values }))
    .map(({ values }) => ({ values, matrix: $$createSVGMatrix()(values) })),
  ...makeMatrixValues().map((values) => ({
    values,
    matrix: $$createSVGMatrix(
      document.createElementNS("http://www.w3.org/2000/svg", "svg")
    )(values),
  })),
];

describe(`$$createSVGMatrix`, function () {
  it(`The return value is a SVGMatrix.`, function () {
    this.slow(2 * 5 * 60 * 1000);
    this.timeout(5 * 60 * 1000);

    const tests = makeTests();
    for (const { matrix } of tests) {
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
    this.slow(2 * 5 * 60 * 1000);
    this.timeout(5 * 60 * 1000);

    const tests = makeTests();
    for (const { matrix, values } of tests) {
      expectSameMatrix(matrix, values);
    }
  });
});
