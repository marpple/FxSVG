import { expect } from "chai";
import { each, go1, mapL } from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";
import { $$createSVGTransform } from "./createSVGTransform.index.js";

const IDENTITY_MATRIX_VALUE = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

const makeCases = () =>
  mapL($$createSVGTransform, [
    undefined,
    document.createElementNS("http://www.w3.org/2000/svg", "svg"),
  ]);

export default ({ describe, it }) => [
  describe(`$$createSVGTransform`, function () {
    it(`The return value is a SVGTransform.`, function () {
      go1(
        makeCases(),
        each((transform) => expect(transform).instanceof(SVGTransform))
      );
    });

    it(`The transform is initialized with an identity matrix.`, function () {
      go1(
        makeCases(),
        each((transform) => {
          expect($$isMatrixSVGTransform(transform)).equal(true);
          expectSameValueSVGMatrix(transform.matrix, IDENTITY_MATRIX_VALUE);
        })
      );
    });
  }),
];
