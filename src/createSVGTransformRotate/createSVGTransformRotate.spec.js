import { expect } from "chai";
import {
  makeAllCombinations,
  makeRandomNumber,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformRotate } from "./createSVGTransformRotate.index.js";

const makeCases = () => {
  const makeSubCases = () =>
    [[], ...makeAllCombinations(["angle", "cx", "cy"])].map((ks) =>
      ks
        .map((k) => [k, makeRandomNumber()])
        .reduce((acc, [k, v]) => {
          acc[k] = v;
          return acc;
        }, {})
    );
  return [
    [$$createSVGTransformRotate()()],
    ...makeSubCases().map((values) => [
      $$createSVGTransformRotate()(values),
      values,
    ]),
    [
      $$createSVGTransformRotate(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    ],
    ...makeSubCases().map((values) => [
      $$createSVGTransformRotate(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(values),
      values,
    ]),
  ];
};

describe(`$$createSVGTransformRotate`, function () {
  it(`The return value is a SVGTransform.`, function () {
    const cases = makeCases();
    for (const [t] of cases) {
      expect(t).to.instanceof(SVGTransform);
    }
  });

  it(`The SVGTransform's type is same with a SVGTransform.SVG_TRANSFORM_ROTATE.`, function () {
    const cases = makeCases();
    for (const [t] of cases) {
      expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_ROTATE);
    }
  });

  it(`
  The SVGTransform's matrix is same with the result using native API(SVGTransform.setRotate). 
  If some arguments are omitted, the omitted values will be 0.
  `, function () {
    const cases = makeCases();
    for (const [t, { angle = 0, cx = 0, cy = 0 } = {}] of cases) {
      const _t = $$createSVGTransform();
      _t.setRotate(angle, cx, cy);
      expect(t.matrix).to.deep.equal(_t.matrix);
    }
  });
});
