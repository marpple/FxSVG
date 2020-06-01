import { expect } from "chai";
import {
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$isRotateSVGTransform } from "./isRotateSVGTransform.index.js";

describe(`$$isRotateSVGTransform`, function () {
  describe(`The function will throw an error when the input value is not a SVGTransform.`, function () {
    it(`Input null.`, function () {
      expect(() => $$isRotateSVGTransform(null)).to.throw();
    });

    it(`Input plain empty object.`, function () {
      expect(() => $$isRotateSVGTransform({})).to.throw();
    });

    it(`Input plain object with type and SVG_TRANSFORM_ROTATE properties.`, function () {
      const obj = {
        type: SVGTransform.SVG_TRANSFORM_ROTATE,
        SVG_TRANSFORM_ROTATE: SVGTransform.SVG_TRANSFORM_ROTATE,
      };
      expect(() => $$isRotateSVGTransform(obj)).to.throw();
    });
  });

  it(`
  The function returns true
  if the SVGTransform's type is same with a SVGTransform.SVG_TRANSFORM_ROTATE.
  `, function () {
    const rotate_t = $$createSVGTransformRotate()({
      angle: makeRandomNumber(),
      cx: makeRandomNumber(),
      cy: makeRandomNumber(),
    });
    const result = $$isRotateSVGTransform(rotate_t);

    expect(result).to.be.true;
  });

  describe(`
  The function returns false
  if the SVGTransform's type is not same with a SVGTransform.SVG_TRANSFORM_ROTATE.
  `, function () {
    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_MATRIX.`, function () {
      const matrix_t = $$createSVGTransformMatrix()(makeRandomSVGMatrix());
      const result = $$isRotateSVGTransform(matrix_t);

      expect(result).to.be.false;
    });

    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
      const translate_t = $$createSVGTransformTranslate()({
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });
      const result = $$isRotateSVGTransform(translate_t);

      expect(result).to.be.false;
    });

    it(`Use a SVGTransform whose type is a SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
      const scale_t = $$createSVGTransformScale()({
        sx: makeRandomNumber(),
        sy: makeRandomNumber(),
      });
      const result = $$isRotateSVGTransform(scale_t);

      expect(result).to.be.false;
    });
  });
});
