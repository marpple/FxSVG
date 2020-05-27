import { expect } from "chai";
import { makeRandomNumber } from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$isTranslateSVGTransform } from "./isTranslateSVGTransform.index.js";

describe(`$$isTranslateSVGTransform`, function () {
  describe(`The function will throw an error when the input value is not a SVGTransform.`, function () {
    it(`Input null.`, function () {
      expect(() => $$isTranslateSVGTransform(null)).to.throw();
    });

    it(`Input plain empty object.`, function () {
      expect(() => $$isTranslateSVGTransform({})).to.throw();
    });

    it(`Input plain object with type and SVG_TRANSFORM_TRANSLATE.`, function () {
      const obj = {
        type: SVGTransform.SVG_TRANSFORM_TRANSLATE,
        SVG_TRANSFORM_SCALE: SVGTransform.SVG_TRANSFORM_TRANSLATE,
      };

      expect(() => $$isTranslateSVGTransform(obj)).to.throw();
    });
  });

  it(`
  The function returns true
  if the SVGTransform's type is same with a SVGTransform.SVG_TRANSFORM_TRANSLATE.
  `, function () {
    const translate_t = $$createSVGTransformTranslate()({
      tx: makeRandomNumber(),
      ty: makeRandomNumber(),
    });
    const result = $$isTranslateSVGTransform(translate_t);

    expect(result).to.be.true;
  });

  describe(`
  The function returns false
  if the SVGTransform's type is not same with a SVGTransform.SVG_TRANSFORM_TRANSLATE.
  `, function () {
    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_MATRIX.`, function () {
      const matrix_t = $$createSVGTransformMatrix()(
        ["a", "b", "c", "d", "e", "f"]
          .map((k) => [k, makeRandomNumber()])
          .reduce((acc, [k, v]) => {
            acc[k] = v;
            return acc;
          }, {})
      );
      const result = $$isTranslateSVGTransform(matrix_t);

      expect(result).to.be.false;
    });

    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
      const scale_t = $$createSVGTransformScale()({
        sx: makeRandomNumber(),
        sy: makeRandomNumber(),
      });
      const result = $$isTranslateSVGTransform(scale_t);

      expect(result).to.be.false;
    });

    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_ROTATE.`, function () {
      const rotate_t = $$createSVGTransformRotate()({
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      const result = $$isTranslateSVGTransform(rotate_t);

      expect(result).to.be.false;
    });
  });
});
