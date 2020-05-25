import { expect } from "chai";
import { $$createSVGMatrix } from "./createSVGMatrix.index.js";

describe(`$$createSVGMatrix`, () => {
  it(`will create SVGMatrix with given values`, () => {
    const [a, b, c, d, e, f] = [...Array(6)].map(() =>
      Math.round(Math.random() * 1000)
    );

    const matrix = $$createSVGMatrix()({ a, b, c, d, e, f });

    expect(matrix.a).to.equal(a);
    expect(matrix.b).to.equal(b);
    expect(matrix.c).to.equal(c);
    expect(matrix.d).to.equal(d);
    expect(matrix.e).to.equal(e);
    expect(matrix.f).to.equal(f);
  });

  it(`will create SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0} if there is no given values`, () => {
    const matrix = $$createSVGMatrix()();

    expect(matrix.a).to.equal(1);
    expect(matrix.b).to.equal(0);
    expect(matrix.c).to.equal(0);
    expect(matrix.d).to.equal(1);
    expect(matrix.e).to.equal(0);
    expect(matrix.f).to.equal(0);
  });

  it(`
  will use default values if there is no given values
  (a: 1, b: 0, c: 0, d: 1, e: 0, f: 0)
  `, () => {
    const [e, f] = [...Array(2)].map(() => Math.round(Math.random() * 1000));

    const matrix = $$createSVGMatrix()({ e, f });

    expect(matrix.a).to.equal(1);
    expect(matrix.b).to.equal(0);
    expect(matrix.c).to.equal(0);
    expect(matrix.d).to.equal(1);
    expect(matrix.e).to.equal(e);
    expect(matrix.f).to.equal(f);
  });
});
