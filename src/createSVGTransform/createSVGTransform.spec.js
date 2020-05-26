import { expect } from "chai";
import { $$createSVGTransform } from "./createSVGTransform.index.js";

describe(`$$createSVGTransform`, () => {
  it(`
  will create SVGTransform
  initialized to an identity matrix transform
  `, () => {
    const t = $$createSVGTransform();

    expect(t).to.be.instanceof(SVGTransform);
    expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_MATRIX);
    expect(t.matrix).to.include({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
  });
});
