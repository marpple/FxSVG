import { expect } from "chai";
import { $$createSVGPoint } from "./createSVGPoint.index.js";

const makeRandomNumber = () => {
  const n = Math.round(Math.random() * 1000);
  return Math.round(Math.random()) ? n : -n;
};

const makeTests = () => {
  const l = [
    {},
    { x: makeRandomNumber() },
    { y: makeRandomNumber() },
    { x: makeRandomNumber(), y: makeRandomNumber() },
  ];
  return [
    { point: $$createSVGPoint()() },
    ...l.map((values) => ({ values, point: $$createSVGPoint()(values) })),
    {
      point: $$createSVGPoint(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    },
    ...l.map((values) => ({
      values,
      point: $$createSVGPoint(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(values),
    })),
  ];
};

describe(`$$createSVGPoint`, () => {
  it(`The return value will be a SVGPoint`, () => {
    const tests = makeTests();
    for (const { point } of tests) {
      expect(point).to.instanceof(SVGPoint);
    }
  });

  it(`
  The point's x, y value will be same with input value
  The omitted value will be 0
  `, () => {
    const tests = makeTests();
    for (const { point, values: { x = 0, y = 0 } = {} } of tests) {
      expect(point.x).to.equal(x);
      expect(point.y).to.equal(y);
    }
  });
});
