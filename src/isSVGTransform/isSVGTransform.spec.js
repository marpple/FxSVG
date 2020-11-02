import chai from "chai";
import {
  makeRandomNumber,
  makeRandomSVGTransformMatrix,
  makeRandomSVGTransformRotate,
  makeRandomSVGTransformScale,
  makeRandomSVGTransformTranslate,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$isSVGTransform } from "./isSVGTransform.index.js";

const { expect } = chai;

export default ({ describe, it }) => [
  describe("$$isSVGTransform", function () {
    describe(`The function will return false...`, function () {
      it(`When the input value is null.`, function () {
        const is_transform = $$isSVGTransform(null);

        expect(is_transform).false;
      });

      it(`When there is no input value.`, function () {
        const is_transform = $$isSVGTransform();

        expect(is_transform).false;
      });

      it(`When the input value is a plain object.`, function () {
        const obj = {};

        const is_transform = $$isSVGTransform(obj);

        expect(is_transform).false;
      });
    });

    describe(`The function will return true if the input value is a SVGTransform.`, function () {
      it(`When the input transform is a matrix transform.`, function () {
        const matrix_transform = makeRandomSVGTransformMatrix();

        const is_transform = $$isSVGTransform(matrix_transform);

        expect(is_transform).true;
      });

      it(`When the input transform is a translate transform.`, function () {
        const translate_transform = makeRandomSVGTransformTranslate();

        const is_transform = $$isSVGTransform(translate_transform);

        expect(is_transform).true;
      });

      it(`When the input transform is a scale transform.`, function () {
        const scale_transform = makeRandomSVGTransformScale();

        const is_transform = $$isSVGTransform(scale_transform);

        expect(is_transform).true;
      });

      it(`When the input transform is a rotate transform.`, function () {
        const rotate_transform = makeRandomSVGTransformRotate();

        const is_transform = $$isSVGTransform(rotate_transform);

        expect(is_transform).true;
      });

      it(`When the input transform is a skew x transform.`, function () {
        const skew_x_transform = $$createSVGTransform();
        skew_x_transform.setSkewX(makeRandomNumber(-100, 100));

        const is_transform = $$isSVGTransform(skew_x_transform);

        expect(is_transform).true;
      });

      it(`When the input transform is a skew y transform.`, function () {
        const skew_y_transform = $$createSVGTransform();
        skew_y_transform.setSkewX(makeRandomNumber(-100, 100));

        const is_transform = $$isSVGTransform(skew_y_transform);

        expect(is_transform).true;
      });
    });
  }),
];
