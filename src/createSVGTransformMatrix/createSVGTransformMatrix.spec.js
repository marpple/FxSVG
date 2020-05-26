import { expect } from "chai";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "./createSVGTransformMatrix.index.js";

describe(`$$createSVGTransformMatrix`, () => {
  it(`will create SVGTransform`, () => {
    const t = $$createSVGTransformMatrix()();

    expect(t).to.instanceof(SVGTransform);
  });

  it(`SVGTransform's type should be the SVGTransform.SVG_TRANSFORM_MATRIX`, () => {
    const t = $$createSVGTransformMatrix()();

    expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_MATRIX);
  });

  it(`SVGTransform will be initialized with the given matrix`, () => {
    const m = $$createSVGMatrix()({
      a: Math.random(),
      b: Math.random(),
      c: Math.random(),
      d: Math.random(),
      e: Math.random(),
      f: Math.random(),
    });
    const t = $$createSVGTransformMatrix()(m);

    expect(t.matrix).to.deep.equal(m);
  });

  it(`SVGTransform will be initialized with identity matrix if there is no passed matrix`, () => {
    const identity_m = $$createSVGMatrix()({
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0,
    });
    const t = $$createSVGTransformMatrix()();

    expect(t.matrix).to.deep.equal(identity_m);
  });
});
