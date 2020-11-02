import chai from "chai";
import { appendL, defaultTo, extend, flatMapL, go, mapL, object } from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  makeAllCombinations,
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "./createSVGTransformMatrix.index.js";

const { expect } = chai;

const makeCases = () =>
  go(
    ["matrix"],
    makeAllCombinations,
    mapL(
      mapL((k) => [k, makeRandomSVGMatrix(() => makeRandomNumber(-100, 100))])
    ),
    mapL(object),
    mapL((values) => ({ values, f: $$createSVGTransformMatrix(values) })),
    appendL({ f: $$createSVGTransformMatrix() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, transform: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformMatrix`, function () {
    it(`The return value is a SVGTransform.`, function () {
      for (const { transform } of makeCases()) {
        expect(transform).instanceof(SVGTransform);
      }
    });

    it(`The transform is a matrix transform.`, function () {
      for (const { transform } of makeCases()) {
        expect($$isMatrixSVGTransform(transform)).true;
      }
    });

    it(`The transform is initialized with the given matrix.
        If there is omitted values or no argument, the transform is initialized with an identity matrix.`, function () {
      for (const { transform, values } of makeCases()) {
        const { matrix } = extend(
          { matrix: $$createSVGMatrix()() },
          defaultTo({}, values)
        );
        expectSameValueSVGMatrix(transform.matrix, matrix);
      }
    });
  }),
];
