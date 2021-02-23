import chai from "chai";
import { mapL, rangeL } from "fxjs/es";
import {
  expectSameValueSVGTransform,
  expectTransformWithTranslateTxTy,
} from "../../test/assertions/index.js";
import {
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateTranslateTransform } from "./updateTranslateTransform.index.js";

const { expect } = chai;

const setupMockTransform = () => {
  const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
  const transform = $$createSVGTransformTranslate({ tx, ty })();
  return { transform, tx, ty };
};

const setupMockInputValues = () => {
  const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
  return { tx, ty };
};

export default ({ describe, it }) => [
  describe(`$$updateTranslateTransform`, function () {
    it(`The tx, ty of the input transform is changed to input tx, ty.`, function () {
      const { transform } = setupMockTransform();
      const { tx, ty } = setupMockInputValues();

      $$updateTranslateTransform({ tx, ty })(transform);

      expectTransformWithTranslateTxTy({ transform, tx, ty });
    });

    it(`The tx of the transform is same with before when there is no input tx.`, function () {
      const { transform, tx } = setupMockTransform();
      const { ty } = setupMockInputValues();

      $$updateTranslateTransform({ ty })(transform);

      expectTransformWithTranslateTxTy({ transform, tx, ty });
    });

    it(`The ty of the transform is same with before when there is no input ty.`, function () {
      const { transform, ty } = setupMockTransform();
      const { tx } = setupMockInputValues();

      $$updateTranslateTransform({ tx })(transform);

      expectTransformWithTranslateTxTy({ transform, tx, ty });
    });

    it(`The tx, ty of the transform is same with before when there is no input object.`, function () {
      const { transform, tx, ty } = setupMockTransform();

      $$updateTranslateTransform()(transform);

      expectTransformWithTranslateTxTy({ transform, tx, ty });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t = $$createSVGTransformMatrix({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        })();
        const { tx, ty } = setupMockInputValues();

        const after_t = $$updateTranslateTransform({ tx, ty })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });

      it(`When the transform is a rotate transform...`, function () {
        const before_t = $$createSVGTransformRotate({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        })();
        const { tx, ty } = setupMockInputValues();

        const after_t = $$updateTranslateTransform({ tx, ty })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });

      it(`When the transform is a scale transform...`, function () {
        const before_t = $$createSVGTransformScale({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        })();
        const { tx, ty } = setupMockInputValues();

        const after_t = $$updateTranslateTransform({ tx, ty })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });
    });
  }),
];
