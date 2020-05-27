import { expect } from "chai";
import { makeRandomNumber } from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "./createSVGTransformMatrix.index.js";

describe(`$$createSVGTransformMatrix`, function () {
  it(`The return value is a SVGTransform.`, function () {
    const ts = [
      $$createSVGTransformMatrix()(),
      $$createSVGTransformMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
      $$createSVGTransformMatrix()($$createSVGMatrix()()),
      $$createSVGTransformMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )($$createSVGMatrix()()),
    ];

    for (const t of ts) {
      expect(t).to.instanceof(SVGTransform);
    }
  });

  it(`The SVGTransform's type should be the SVGTransform.SVG_TRANSFORM_MATRIX.`, function () {
    const ts = [
      $$createSVGTransformMatrix()(),
      $$createSVGTransformMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
      $$createSVGTransformMatrix()($$createSVGMatrix()()),
      $$createSVGTransformMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )($$createSVGMatrix()()),
    ];

    for (const t of ts) {
      expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_MATRIX);
    }
  });

  it(`The SVGTransform will be initialized with the given matrix.`, function () {
    const m = $$createSVGMatrix()({
      a: makeRandomNumber(),
      b: makeRandomNumber(),
      c: makeRandomNumber(),
      d: makeRandomNumber(),
      e: makeRandomNumber(),
      f: makeRandomNumber(),
    });
    const ts = [
      $$createSVGTransformMatrix()(m),
      $$createSVGTransformMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(m),
    ];

    for (const t of ts) {
      expect(t.matrix).to.deep.equal(m);
    }
  });

  it(`The SVGTransform will be initialized with identity matrix if there is no passed matrix.`, function () {
    const identity_m = $$createSVGMatrix()({
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0,
    });

    const ts = [
      $$createSVGTransformMatrix()(),
      $$createSVGTransformMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    ];

    for (const t of ts) {
      expect(t.matrix).to.deep.equal(identity_m);
    }
  });
});
