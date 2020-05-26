import { expect } from "chai";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformRotate } from "./createSVGTransformRotate.index.js";

const makeRandomNumber = () => {
  const n = Math.random() * 100;
  return Math.round(Math.random()) ? n : -n;
};

const makeTests = () =>
  [
    {},
    { values: {} },
    { values: { angle: makeRandomNumber() } },
    { values: { cx: makeRandomNumber() } },
    { values: { cy: makeRandomNumber() } },
    { values: { angle: makeRandomNumber(), cx: makeRandomNumber() } },
    { values: { angle: makeRandomNumber(), cy: makeRandomNumber() } },
    { values: { cx: makeRandomNumber(), cy: makeRandomNumber() } },
    {
      values: {
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      },
    },
    { $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg") },
    {
      $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      values: {},
    },
    {
      $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      values: { angle: makeRandomNumber() },
    },
    {
      $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      values: { cx: makeRandomNumber() },
    },
    {
      $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      values: { cy: makeRandomNumber() },
    },
    {
      $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      values: { angle: makeRandomNumber(), cx: makeRandomNumber() },
    },
    {
      $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      values: { angle: makeRandomNumber(), cy: makeRandomNumber() },
    },
    {
      $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      values: { cx: makeRandomNumber(), cy: makeRandomNumber() },
    },
    {
      $svg: document.createElementNS("http://www.w3.org/2000/svg", "svg"),
      values: {
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      },
    },
  ].map(({ $svg, values }) => [
    $$createSVGTransformRotate($svg)(values),
    values,
  ]);

describe(`$$createSVGTransformRotate`, () => {
  it(`The return value is a SVGTransform.`, () => {
    const tests = makeTests();
    for (const [t] of tests) {
      expect(t).to.instanceof(SVGTransform);
    }
  });

  it(`The SVGTransform's type is same with a SVGTransform.SVG_TRANSFORM_ROTATE.`, () => {
    const tests = makeTests();
    for (const [t] of tests) {
      expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_ROTATE);
    }
  });

  it(`
  The SVGTransform's matrix is same with the result using native API (SVGTransform.setRotate)
  If some arguments are omitted, the omitted values will be 0
  `, () => {
    const tests = makeTests();
    for (const [t, { angle = 0, cx = 0, cy = 0 } = {}] of tests) {
      const _t = $$createSVGTransform();
      _t.setRotate(angle, cx, cy);
      expect(t.matrix).to.deep.equal(_t.matrix);
    }
  });
});
