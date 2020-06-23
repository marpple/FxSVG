import { expect } from "chai";
import { go, mapL, rangeL, tap } from "fxjs2";
import {
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$isTranslateSVGTransform } from "../isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { $$updateTranslateTransform } from "./updateTranslateTransform.index.js";

const setupMockTransform = () => {
  const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
  const transform = $$createSVGTransformTranslate()({ tx, ty });
  return { transform, tx, ty };
};

const setupMockInputValues = () => {
  const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
  return { tx, ty };
};

const expectTransformWithTxTy = ({ transform, tx, ty }) => {
  const matrix = go(
    $$createSVGTransform(),
    tap((transform) => transform.setTranslate(tx, ty)),
    ({ matrix }) => matrix
  );

  expect($$isTranslateSVGTransform(transform)).true;
  expect(transform.matrix).deep.equal(matrix);
};

export default ({ describe, it }) => [
  describe.only(`$$updateTranslateTransform`, function () {
    it(`The tx, ty of the input transform is changed to input tx, ty.`, function () {
      const { transform } = setupMockTransform();
      const { tx, ty } = setupMockInputValues();
      $$updateTranslateTransform(transform, { tx, ty });

      expectTransformWithTxTy({ transform, tx, ty });
    });

    it(`The tx of the transform is same with before when there is no input tx.`, function () {
      const { transform, tx } = setupMockTransform();
      const { ty } = setupMockInputValues();
      $$updateTranslateTransform(transform, { ty });

      expectTransformWithTxTy({ transform, tx, ty });
    });

    it(`The ty of the transform is same with before when there is no input ty.`, function () {
      const { transform, ty } = setupMockTransform();
      const { tx } = setupMockInputValues();
      $$updateTranslateTransform(transform, { tx });

      expectTransformWithTxTy({ transform, tx, ty });
    });

    it(`The tx, ty of the transform is same with before when there is no input object.`, function () {
      const { transform, tx, ty } = setupMockTransform();
      $$updateTranslateTransform(transform);

      expectTransformWithTxTy({ transform, tx, ty });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t = $$updateTranslateTransform(before_t, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });

      it(`When the transform is a rotate transform...`, function () {
        const before_t = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t = $$updateTranslateTransform(before_t, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });

      it(`When the transform is a scale transform...`, function () {
        const before_t = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t = $$updateTranslateTransform(before_t, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });
    });
  }),
];
