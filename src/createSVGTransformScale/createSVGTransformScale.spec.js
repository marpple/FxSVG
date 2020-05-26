import { expect } from "chai";
import { $$createSVGTransformScale } from "./createSVGTransformScale.index.js";

const makeRandomNumber = () => {
  const n = Math.round(Math.random() * 100000);
  return Math.round(Math.random()) ? n : -n;
};

const makeTests = () => {
  const l = [
    {},
    { sx: makeRandomNumber() },
    { sy: makeRandomNumber() },
    { sx: makeRandomNumber(), sy: makeRandomNumber() },
  ];
  return [
    { t: $$createSVGTransformScale()() },
    ...l.map(({ sx, sy }) => ({
      t: $$createSVGTransformScale()({ sx, sy }),
      sx,
      sy,
    })),
    {
      t: $$createSVGTransformScale(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )(),
    },
    ...l.map(({ sx, sy }) => ({
      t: $$createSVGTransformScale(
        document.createElementNS("http://www.w3.org/2000/svg", "svg")
      )({ sx, sy }),
      sx,
      sy,
    })),
  ];
};

describe(`$$createSVGTransformScale`, function () {
  it(`The return value will be a SVGTransform.`, function () {
    const tests = makeTests();

    for (const { t } of tests) {
      expect(t).to.instanceof(SVGTransform);
    }
  });

  it(`The SVGTransform's type will be the SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
    const tests = makeTests();

    for (const { t } of tests) {
      expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_SCALE);
    }
  });

  it(`
  The SVGTransform's scale value will be set to the input value. (matrix.a = sx, matrix.d = sy)
  The omitted values will be 1.
  `, function () {
    const tests = makeTests();

    for (const { t, sx = 1, sy = 1 } of tests) {
      expect(t.matrix.a).to.equal(sx);
      expect(t.matrix.d).to.equal(sy);
    }
  });
});
