import { expect } from "chai";
import { makeAllCombinations } from "../../test/utils/index.js";
import { $$createSVGTransformTranslate } from "./createSVGTransformTranslate.index.js";

const makeRandomNumber = () => {
  const n = Math.round(Math.random() * 1000);
  return Math.round(Math.random()) ? n : -n;
};

const makeCases = () => {
  const makeSubCases = () =>
    [[], ...makeAllCombinations(["tx", "ty"])].map((ks) =>
      ks
        .map((k) => [k, makeRandomNumber()])
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {})
    );
  return [
    { t: $$createSVGTransformTranslate()() },
    ...makeSubCases().map((values) => ({
      t: $$createSVGTransformTranslate()(values),
      values,
    })),
    {
      t: $$createSVGTransformTranslate(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    },
    ...makeSubCases().map((values) => ({
      t: $$createSVGTransformTranslate(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(values),
      values,
    })),
  ];
};

describe(`$$createSVGTransformTranslate`, function () {
  it(`The return value will be a SVGTransform.`, function () {
    const cases = makeCases();

    for (const { t } of cases) {
      expect(t).to.instanceof(SVGTransform);
    }
  });

  it(`The SVGTransform's type will be the SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
    const cases = makeCases();

    for (const { t } of cases) {
      expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_TRANSLATE);
    }
  });

  it(`
  The SVGTransform's translate values will be same with the input values. (matrix.e = tx, matrix.f = ty)
  The omitted values will be 0.
  `, function () {
    const cases = makeCases();

    for (const { t, values: { tx = 0, ty = 0 } = {} } of cases) {
      expect(t.matrix.e).to.equal(tx);
      expect(t.matrix.f).to.equal(ty);
    }
  });
});
