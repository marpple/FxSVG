import chai from "chai";
import { appendL, defaultTo, extend, flatMapL, go, mapL, object } from "fxjs";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate.index.js";

const { expect } = chai;

const makeCases = () =>
  go(
    ["tx", "ty"],
    makeAllCombinations,
    mapL(mapL((k) => [k, makeRandomInt()])),
    mapL(object),
    mapL((values) => ({ values, f: $$createSVGTransformTranslate(values) })),
    appendL({ f: $$createSVGTransformTranslate() }),
    flatMapL(({ values, f }) =>
      mapL(($svg) => ({ values, transform: f($svg) }), [
        undefined,
        document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      ])
    )
  );

export default ({ describe, it }) => [
  describe(`$$createSVGTransformTranslate`, function () {
    it(`The return value is a SVGTransform.`, function () {
      for (const { transform } of makeCases()) {
        expect(transform).instanceof(SVGTransform);
      }
    });

    it(`The transform's type is the SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
      for (const { transform } of makeCases()) {
        expect($$isTranslateSVGTransform(transform)).true;
      }
    });

    it(`The transform is initialized with the given tx, ty.
        If there are omitted values or no argument,
        the values will be {tx: 0, ty: 0} individually by default.`, function () {
      for (const { transform, values } of makeCases()) {
        const { tx, ty } = extend({ tx: 0, ty: 0 }, defaultTo({}, values));
        const expect_transform = $$createSVGTransform();
        expect_transform.setTranslate(tx, ty);
        expectSameValueSVGTransform(transform, expect_transform);
      }
    });
  }),
];
