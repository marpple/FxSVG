import { expect } from "chai";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGTransformScale } from "./createSVGTransformScale.index.js";

const makeCases = () => {
  const makeSubCases = () =>
    [[], ...makeAllCombinations(["sx", "sy"])].map((ks) =>
      ks
        .map((k) => [k, makeRandomInt()])
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {})
    );
  return [
    { t: $$createSVGTransformScale()() },
    ...makeSubCases().map((values) => ({
      t: $$createSVGTransformScale()(values),
      values,
    })),
    {
      t: $$createSVGTransformScale(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    },
    ...makeSubCases().map((values) => ({
      t: $$createSVGTransformScale(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(values),
      values,
    })),
  ];
};

describe(`$$createSVGTransformScale`, function () {
  it(`The return value will be a SVGTransform.`, function () {
    const cases = makeCases();

    for (const { t } of cases) {
      expect(t).to.instanceof(SVGTransform);
    }
  });

  it(`The SVGTransform's type will be the SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
    const cases = makeCases();

    for (const { t } of cases) {
      expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_SCALE);
    }
  });

  it(`
  The SVGTransform's scale value will be set to the input value. (matrix.a = sx, matrix.d = sy)
  The omitted values will be 1.
  `, function () {
    const cases = makeCases();

    for (const { t, values: { sx = 1, sy = 1 } = {} } of cases) {
      expect(t.matrix.a).to.equal(sx);
      expect(t.matrix.d).to.equal(sy);
    }
  });
});
