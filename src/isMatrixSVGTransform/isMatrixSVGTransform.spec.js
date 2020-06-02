import { expect } from "chai";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomSVGMatrix } from "../../test/utils/makeRandomSVGMatrix.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$isMatrixSVGTransform } from "./isMatrixSVGTransform.index.js";

describe(`$$isMatrixSVGTransform`, function () {
  describe(`The function will throw an error when the input value is not a SVGTransform.`, function () {
    it(`Input null.`, function () {
      expect(() => $$isMatrixSVGTransform(null)).to.throw();
    });

    it(`Input plain empty object.`, function () {
      expect(() => $$isMatrixSVGTransform({})).to.throw();
    });

    it(`Input plain object with type and SVG_TRANSFORM_ROTATE properties.`, function () {
      const obj = {
        type: SVGTransform.SVG_TRANSFORM_MATRIX,
        SVG_TRANSFORM_MATRIX: SVGTransform.SVG_TRANSFORM_MATRIX,
      };
      expect(() => $$isMatrixSVGTransform(obj)).to.throw();
    });
  });

  it(`
  The function returns true
  if the SVGTransform's type is same with a SVGTransform.SVG_TRANSFORM_MATRIX.
  `, function () {
    const matrix_t = $$createSVGTransformMatrix()({
      matrix: makeRandomSVGMatrix(),
    });
    const result = $$isMatrixSVGTransform(matrix_t);

    expect(result).to.be.true;
  });

  describe(`
  The function returns false
  if the SVGTransform's type is not same with a SVGTransform.SVG_TRANSFORM_MATRIX.
  `, function () {
    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_ROTATE.`, function () {
      const matrix_t = $$createSVGTransformRotate()({
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      const result = $$isMatrixSVGTransform(matrix_t);

      expect(result).to.be.false;
    });

    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
      const translate_t = $$createSVGTransformTranslate()({
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });
      const result = $$isMatrixSVGTransform(translate_t);

      expect(result).to.be.false;
    });

    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
      const scale_t = $$createSVGTransformScale()({
        sx: makeRandomNumber(),
        sy: makeRandomNumber(),
      });
      const result = $$isMatrixSVGTransform(scale_t);

      expect(result).to.be.false;
    });
  });
});
