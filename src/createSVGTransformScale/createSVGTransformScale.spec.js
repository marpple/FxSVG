import { expect } from "chai";
import { appendL, defaultTo, extend, flatMapL, go, mapL, object } from "fxjs2";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$isSVGTransform } from "../isSVGTransform/isSVGTransform.index.js";
import { $$createSVGTransformScale } from "./createSVGTransformScale.index.js";

const makeCases = () =>
  go(
    ["sx", "sy"],
    makeAllCombinations,
    mapL(mapL((k) => [k, makeRandomInt()])),
    mapL(object),
    mapL((values) => ({ values, f: $$createSVGTransformScale(values) })),
    appendL({ f: $$createSVGTransformScale() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, transform: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformScale`, function () {
    it(`The return value is a SVGTransform.`, function () {
      for (const { transform } of makeCases()) {
        expect($$isSVGTransform(transform)).true;
      }
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
      for (const { transform } of makeCases()) {
        expect($$isScaleSVGTransform(transform)).true;
      }
    });

    it(`The transform is initialized with the given sx, sy.
        If there are omitted values or no argument,
        the values will be {sx: 1, sy: 1} individually by default.`, function () {
      for (const { transform, values } of makeCases()) {
        const { sx, sy } = extend({ sx: 1, sy: 1 }, defaultTo({}, values));
        const expect_transform = $$createSVGTransform();
        expect_transform.setScale(sx, sy);
        expectSameValueSVGTransform(transform, expect_transform);
      }
    });
  }),
];
