import { expect } from "chai";
import {
  appendL,
  defaultTo,
  each,
  extend,
  flatMapL,
  go,
  mapL,
  object,
  pipe,
} from "fxjs2";
import { expectSameValueSVGMatrix } from "../../test/assertions/index.js";
import {
  makeAllCombinations,
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "./createSVGTransformMatrix.index.js";

const makeCases = () =>
  flatMapL(
    (f) =>
      go(
        ["matrix"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [
              k,
              makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
            ]),
            object
          )
        ),
        mapL((values) => ({ values, transform: f(values) })),
        appendL({ transform: f() })
      ),
    [
      $$createSVGTransformMatrix(),
      $$createSVGTransformMatrix(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      ),
    ]
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformMatrix`, function () {
    it(`The return value is a SVGTransform.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        each((transform) => expect(transform).to.instanceof(SVGTransform))
      );
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_MATRIX.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        mapL(({ type }) => type),
        each((type) => expect(type).to.equal(SVGTransform.SVG_TRANSFORM_MATRIX))
      );
    });

    it(`The transform is initialized with the given matrix.
        If there is omitted values or no argument, the transform is initialized with an identity matrix.`, function () {
      go(
        makeCases(),
        mapL(({ transform, values }) =>
          go(
            values,
            defaultTo({}),
            (values) => extend({ matrix: $$createSVGMatrix()() }, values),
            (values) => ({ values, transform })
          )
        ),
        each(({ transform, values: { matrix } }) =>
          expectSameValueSVGMatrix(transform.matrix, matrix)
        )
      );
    });
  }),
];
