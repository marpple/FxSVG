import { expect } from "chai";
import { makeAllCombinations, makeRandomInt } from "../../test/utils/index.js";
import { $$createSVGPoint } from "./createSVGPoint.index.js";

const makeCases = () => {
  const makeSubCases = () => [
    {},
    ...makeAllCombinations(["x", "y"]).map((ks) =>
      ks
        .map((k) => [k, makeRandomInt()])
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {})
    ),
  ];
  return [
    { point: $$createSVGPoint()() },
    ...makeSubCases().map((values) => ({
      values,
      point: $$createSVGPoint()(values),
    })),
    {
      point: $$createSVGPoint(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    },
    ...makeSubCases().map((values) => ({
      values,
      point: $$createSVGPoint(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(values),
    })),
  ];
};

describe(`$$createSVGPoint`, () => {
  it(`The return value will be a SVGPoint.`, () => {
    const cases = makeCases();
    for (const { point } of cases) {
      expect(point).to.instanceof(SVGPoint);
    }
  });

  it(`
  The point's x, y value will be same with input value.
  The omitted value will be 0.
  `, () => {
    const cases = makeCases();
    for (const { point, values: { x = 0, y = 0 } = {} } of cases) {
      expect(point.x).to.equal(x);
      expect(point.y).to.equal(y);
    }
  });
});
