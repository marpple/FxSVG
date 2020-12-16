import chai from "chai";
import {
  appendL,
  defaultTo,
  extend,
  flatMapL,
  go,
  mapL,
  object,
} from "fxjs/es";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import {
  makeAllCombinations,
  makeRandomNumber,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$isRotateSVGTransform } from "../isRotateSVGTransform/isRotateSVGTransform.index.js";
import { $$isSVGTransform } from "../isSVGTransform/isSVGTransform.index.js";
import { $$createSVGTransformRotate } from "./createSVGTransformRotate.index.js";

const { expect } = chai;

const makeCases = () =>
  go(
    ["angle", "cx", "cy"],
    makeAllCombinations,
    mapL(mapL((k) => [k, makeRandomNumber(-100, 100)])),
    mapL(object),
    mapL((values) => ({ values, f: $$createSVGTransformRotate(values) })),
    appendL({ f: $$createSVGTransformRotate() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, transform: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformRotate`, function () {
    it(`The return value is a SVGTransform.`, function () {
      for (const { transform } of makeCases()) {
        expect($$isSVGTransform(transform)).true;
      }
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_ROTATE.`, function () {
      for (const { transform } of makeCases()) {
        expect($$isRotateSVGTransform(transform)).true;
      }
    });

    it(`The transform is initialized with the given angle, cx, cy.
        If there are omitted values or no argument,
        the values will be {angle: 0, cx: 0, cy: 0} individually by default.`, function () {
      for (const { transform, values } of makeCases()) {
        const { angle, cx, cy } = extend(
          { angle: 0, cx: 0, cy: 0 },
          defaultTo({}, values)
        );
        const expect_transform = $$createSVGTransform();
        expect_transform.setRotate(angle, cx, cy);
        expectSameValueSVGTransform(transform, expect_transform);
      }
    });
  }),
];
