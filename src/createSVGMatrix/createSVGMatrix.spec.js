import { createSVGWindow } from "svgdom";
import { $$createSVGMatrix } from "./createSVGMatrix.index.js";

describe(`$$createSVGMatrix`, () => {
  let $dummy_svg;

  beforeEach(() => {
    $dummy_svg = createSVGWindow().document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
  });

  test(`will create SVGMatrix with given values`, () => {
    const [a, b, c, d, e, f] = [...Array(6)].map(() =>
      Math.round(Math.random() * 1000)
    );

    const matrix = $$createSVGMatrix($dummy_svg)({ a, b, c, d, e, f });

    expect(matrix.a).toEqual(a);
    expect(matrix.b).toEqual(b);
    expect(matrix.c).toEqual(c);
    expect(matrix.d).toEqual(d);
    expect(matrix.e).toEqual(e);
    expect(matrix.f).toEqual(f);
  });

  test(`will create SVGMatrix {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0} if there is no given values`, () => {
    const matrix = $$createSVGMatrix($dummy_svg)();

    expect(matrix.a).toEqual(1);
    expect(matrix.b).toEqual(0);
    expect(matrix.c).toEqual(0);
    expect(matrix.d).toEqual(1);
    expect(matrix.e).toEqual(0);
    expect(matrix.f).toEqual(0);
  });

  test(`
  will use default values if there is no given values
  (a: 1, b: 0, c: 0, d: 1, e: 0, f: 0)
  `, () => {
    const [e, f] = [...Array(2)].map(() => Math.round(Math.random() * 1000));

    const matrix = $$createSVGMatrix($dummy_svg)({ e, f });

    expect(matrix.a).toEqual(1);
    expect(matrix.b).toEqual(0);
    expect(matrix.c).toEqual(0);
    expect(matrix.d).toEqual(1);
    expect(matrix.e).toEqual(e);
    expect(matrix.f).toEqual(f);
  });
});
