import { expect } from "chai";
import {
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$isTranslateSVGTransform } from "./isTranslateSVGTransform.index.js";

export default ({ describe, it }) => [
  describe(`$$isTranslateSVGTransform`, function () {
    describe(`The function will return false...`, function () {
      it(`When the input value is null.`, function () {
        const result = $$isTranslateSVGTransform(null);

        expect(result).to.be.false;
      });

      it(`When the input value is a plain empty object.`, function () {
        const result = $$isTranslateSVGTransform({});

        expect(result).to.be.false;
      });

      it(`When the input value is a plain object like
          { type: SVGTransform.SVG_TRANSFORM_TRANSLATE, SVG_TRANSFORM_TRANSLATE: SVGTransform.SVG_TRANSFORM_TRANSLATE }.`, function () {
        const obj = {
          type: SVGTransform.SVG_TRANSFORM_TRANSLATE,
          SVG_TRANSFORM_TRANSLATE: SVGTransform.SVG_TRANSFORM_TRANSLATE,
        };
        const result = $$isTranslateSVGTransform(obj);

        expect(result).to.be.false;
      });

      it(`When the input value is a SVGTransform whose type is the SVGTransform.SVG_TRANSFORM_MATRIX.`, function () {
        const matrix_t = $$createSVGTransformMatrix({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        })();
        const result = $$isTranslateSVGTransform(matrix_t);

        expect(result).to.be.false;
      });

      it(`When the input value is a SVGTransform whose type is the SVGTransform.SVG_TRANSFORM_ROTATE.`, function () {
        const rotate_t = $$createSVGTransformRotate({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        })();
        const result = $$isTranslateSVGTransform(rotate_t);

        expect(result).to.be.false;
      });

      it(`When the input value is a SVGTransform whose type is the SVGTransform.SVG_TRANSFORM_SCALE.`, function () {
        const scale_t = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });
        const result = $$isTranslateSVGTransform(scale_t);

        expect(result).to.be.false;
      });
    });

    describe(`The function will return true...`, function () {
      it(`When the input value is a SVGTransform and the type is SVGTransform.SVG_TRANSFORM_TRANSLATE.`, function () {
        const translate_t = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });
        const result = $$isTranslateSVGTransform(translate_t);

        expect(result).to.be.true;
      });
    });
  }),
];
