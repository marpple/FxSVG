import { expect } from "chai";
import { each, flatMapL, go, mapL } from "fxjs2";
import { makeRandomSVGMatrix } from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "./createSVGTransformMatrix.index.js";

describe(`$$createSVGTransformMatrix`, function () {
  it(`The return value is a SVGTransform.`, function () {
    go(
      [
        $$createSVGTransformMatrix(),
        $$createSVGTransformMatrix(
          document.createElementNS("http://www.w3.org/2000/svg", "svg")
        ),
      ],
      flatMapL((f) => [f(), f($$createSVGMatrix()())]),
      each((t) => expect(t).to.instanceof(SVGTransform))
    );
  });

  it(`The SVGTransform's type should be the SVGTransform.SVG_TRANSFORM_MATRIX.`, function () {
    go(
      [
        $$createSVGTransformMatrix(),
        $$createSVGTransformMatrix(
          document.createElementNS("http://www.w3.org/2000/svg", "svg")
        ),
      ],
      flatMapL((f) => [f(), f($$createSVGMatrix()())]),
      mapL(({ type: t }) => t),
      each((t) => expect(t).to.equal(SVGTransform.SVG_TRANSFORM_MATRIX))
    );
  });

  it(`The SVGTransform will be initialized with the given matrix.`, function () {
    const m = makeRandomSVGMatrix();
    go(
      [
        $$createSVGTransformMatrix(),
        $$createSVGTransformMatrix(
          document.createElementNS("http://www.w3.org/2000/svg", "svg")
        ),
      ],
      mapL((f) => f(m)),
      mapL(({ matrix: m }) => m),
      each((_m) => expect(_m).to.deep.equal(m))
    );
  });

  it(`The SVGTransform will be initialized with identity matrix if there is no passed matrix.`, function () {
    const identity_m = $$createSVGMatrix()();
    go(
      [
        $$createSVGTransformMatrix(),
        $$createSVGTransformMatrix(
          document.createElementNS("http://www.w3.org/2000/svg", "svg")
        ),
      ],
      mapL((f) => f()),
      mapL(({ matrix: m }) => m),
      each((m) => expect(m).to.deep.equal(identity_m))
    );
  });
});
