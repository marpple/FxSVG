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
import {
  makeAllCombinations,
  makeRandomNumber,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformRotate } from "./createSVGTransformRotate.index.js";

const makeCases = () =>
  flatMapL(
    (f) =>
      go(
        ["angle", "cx", "cy"],
        makeAllCombinations,
        mapL(
          pipe(
            mapL((k) => [k, makeRandomNumber(-100, 100)]),
            object
          )
        ),
        mapL((values) => ({ values, transform: f(values) })),
        appendL({ transform: f() })
      ),
    [
      $$createSVGTransformRotate(),
      $$createSVGTransformRotate(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      ),
    ]
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformRotate`, function () {
    it(`The return value is a SVGTransform.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        each((t) => expect(t).to.instanceof(SVGTransform))
      );
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_ROTATE.`, function () {
      go(
        makeCases(),
        mapL(({ transform: t }) => t),
        mapL(({ type }) => type),
        each((t) => expect(t).to.equal(SVGTransform.SVG_TRANSFORM_ROTATE))
      );
    });

    it(`The transform is initialized with the given angle, cx, cy.
        If there are omitted values or no argument,
        the values will be {angle: 0, cx: 0, cy: 0} individually by default.`, function () {
      go(
        makeCases(),
        mapL(({ transform, values }) =>
          go(
            values,
            defaultTo({}),
            (values) => extend({ angle: 0, cx: 0, cy: 0 }, values),
            (values) => ({ values, transform })
          )
        ),
        mapL(({ transform: receive_transform, values: { angle, cx, cy } }) => {
          const expect_transform = $$createSVGTransform();
          expect_transform.setRotate(angle, cx, cy);
          return { receive_transform, expect_transform };
        }),
        each(({ receive_transform, expect_transform }) =>
          expect(receive_transform).to.deep.equal(expect_transform)
        )
      );
    });
  }),
];
