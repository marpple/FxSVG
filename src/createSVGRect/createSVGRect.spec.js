import { expect } from "chai";
import { makeAllCombinations } from "../../test/utils/index.js";
import { $$createSVGRect } from "./createSVGRect.index.js";

const makeRandomNumber = () => {
  const n = Math.round(Math.random() * 1000);
  return Math.round(Math.random()) ? n : -n;
};

const makeCases = () => {
  const makeSubCases = () =>
    [[], ...makeAllCombinations(["x", "y", "width", "height"])].map((ks) =>
      ks
        .map((k) => [k, makeRandomNumber()])
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {})
    );

  return [
    { rect: $$createSVGRect()() },
    ...makeSubCases().map((values) => ({
      values,
      rect: $$createSVGRect()(values),
    })),
    {
      rect: $$createSVGRect(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    },
    ...makeSubCases().map((values) => ({
      values,
      rect: $$createSVGRect(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(values),
    })),
  ];
};

describe(`$$createSVGRect`, function () {
  it(`The return value will be a SVGRect.`, function () {
    const cases = makeCases();

    for (const { rect } of cases) {
      expect(rect).to.instanceof(SVGRect);
    }
  });

  it(`
  The SVGRect's each values are same with input values.
  The omitted values will be 0.
  `, function () {
    const cases = makeCases();

    for (const {
      rect,
      values: { x = 0, y = 0, width = 0, height = 0 } = {},
    } of cases) {
      expect(rect.x).to.equal(x);
      expect(rect.y).to.equal(y);
      expect(rect.width).to.equal(width);
      expect(rect.height).to.equal(height);
    }
  });
});
