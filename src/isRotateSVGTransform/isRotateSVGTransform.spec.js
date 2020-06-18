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

export default ({ describe, it }) => [
  describe(`$$isRotateSVGTransform`, function () {
    describe(`The function will return false...`, function () {
      it(`When the input value is null.`, function () {
        const result = $$isRotateSVGTransform(null);

        expect(result).to.be.false;
      });

      it(`When the input value is a plain empty object.`, function () {
        const result = $$isRotateSVGTransform({});

        expect(result).to.be.false;
      });

      it(`When the input value is a plain object like
          { type: SVGTransform.SVG_TRANSFORM_ROTATE, SVG_TRANSFORM_ROTATE: SVGTransform.SVG_TRANSFORM_ROTATE }.`, function () {
        const obj = {
          type: SVGTransform.SVG_TRANSFORM_ROTATE,
          SVG_TRANSFORM_ROTATE: SVGTransform.SVG_TRANSFORM_ROTATE,
        };
        const result = $$isRotateSVGTransform(obj);

        expect(result).to.be.false;
      });

      it(`When the input value is a SVGTransform whose type is the SVGTransform.SVG_TRANSFORM_MATRIX.`, function () {
        const matrix_t = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });
        const result = $$isRotateSVGTransform(matrix_t);

        expect(result).to.be.false;
      });

      it(`When the input value is a SVGTransform whose type is the SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
        const scale_t = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });
        const result = $$isRotateSVGTransform(scale_t);

        expect(result).to.be.false;
      });

      it(`When the input value is a SVGTransform whose type is the SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
        const translate_t = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });
        const result = $$isRotateSVGTransform(translate_t);

        expect(result).to.be.false;
      });
    });

    describe(`The function will return true...`, function () {
      it(`When the input value is a SVGTransform and the type is SVGTransform.SVG_TRANSFORM_ROTATE.`, function () {
        const rotate_t = $$createSVGTransformRotate()({
          angle: makeRandomNumber(),
          cx: makeRandomNumber(),
          cy: makeRandomNumber(),
        });
        const result = $$isRotateSVGTransform(rotate_t);

        expect(result).to.be.true;
      });
    });
  }),
];
