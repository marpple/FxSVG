import { expect } from "chai";
import { $$createSVGTransform } from "./createSVGTransform.index.js";

export default ({ describe, it }) => [
  describe(`$$createSVGTransform`, function () {
    it(`The return value will be a SVGTransform.`, function () {
      const t = $$createSVGTransform();

      expect(t).to.be.instanceof(SVGTransform);
    });

    it(`The SVGTransform will be initialized with an identity matrix.`, function () {
      const t = $$createSVGTransform();

      expect(t.type).to.equal(SVGTransform.SVG_TRANSFORM_MATRIX);
      expect(t.matrix).to.include({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 });
    });
  }),
];
