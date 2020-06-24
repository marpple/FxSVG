import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { expectTransformWithTranslateTxTy } from "../../test/assertions/index.js";
import {
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import {
  $$updateTranslateTransform,
  $$updateTranslateTransform2,
  $$updateTranslateTransform3,
} from "./updateTranslateTransform.index.js";

const setupMockTransform = () => {
  const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
  const transform = $$createSVGTransformTranslate()({ tx, ty });
  return { transform, tx, ty };
};

const setupMockInputValues = () => {
  const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
  return { tx, ty };
};

export default ({ describe, it }) => [
  describe(`$$updateTranslateTransform`, function () {
    it(`The tx, ty of the input transform is changed to input tx, ty.`, function () {
      const { transform: transform1 } = setupMockTransform();
      const { tx: tx1, ty: ty1 } = setupMockInputValues();
      $$updateTranslateTransform(transform1, { tx: tx1, ty: ty1 });

      expectTransformWithTranslateTxTy({
        transform: transform1,
        tx: tx1,
        ty: ty1,
      });

      const { transform: transform2 } = setupMockTransform();
      const { tx: tx2, ty: ty2 } = setupMockInputValues();
      $$updateTranslateTransform2({ tx: tx2, ty: ty2 })(transform2);

      expectTransformWithTranslateTxTy({
        transform: transform2,
        tx: tx2,
        ty: ty2,
      });

      const { transform: transform3 } = setupMockTransform();
      const { tx: tx3, ty: ty3 } = setupMockInputValues();
      $$updateTranslateTransform3({ tx: tx3, ty: ty3 }, transform3);

      expectTransformWithTranslateTxTy({
        transform: transform3,
        tx: tx3,
        ty: ty3,
      });
    });

    it(`The tx of the transform is same with before when there is no input tx.`, function () {
      const { transform: transform1, tx: tx1 } = setupMockTransform();
      const { ty: ty1 } = setupMockInputValues();
      $$updateTranslateTransform(transform1, { ty: ty1 });

      expectTransformWithTranslateTxTy({
        transform: transform1,
        tx: tx1,
        ty: ty1,
      });

      const { transform: transform2, tx: tx2 } = setupMockTransform();
      const { ty: ty2 } = setupMockInputValues();
      $$updateTranslateTransform2({ ty: ty2 })(transform2);

      expectTransformWithTranslateTxTy({
        transform: transform2,
        tx: tx2,
        ty: ty2,
      });

      const { transform: transform3, tx: tx3 } = setupMockTransform();
      const { ty: ty3 } = setupMockInputValues();
      $$updateTranslateTransform3({ ty: ty3 }, transform3);

      expectTransformWithTranslateTxTy({
        transform: transform3,
        tx: tx3,
        ty: ty3,
      });
    });

    it(`The ty of the transform is same with before when there is no input ty.`, function () {
      const { transform: transform1, ty: ty1 } = setupMockTransform();
      const { tx: tx1 } = setupMockInputValues();
      $$updateTranslateTransform(transform1, { tx: tx1 });

      expectTransformWithTranslateTxTy({
        transform: transform1,
        tx: tx1,
        ty: ty1,
      });

      const { transform: transform2, ty: ty2 } = setupMockTransform();
      const { tx: tx2 } = setupMockInputValues();
      $$updateTranslateTransform2({ tx: tx2 })(transform2);

      expectTransformWithTranslateTxTy({
        transform: transform2,
        tx: tx2,
        ty: ty2,
      });

      const { transform: transform3, ty: ty3 } = setupMockTransform();
      const { tx: tx3 } = setupMockInputValues();
      $$updateTranslateTransform3({ tx: tx3 }, transform3);

      expectTransformWithTranslateTxTy({
        transform: transform3,
        tx: tx3,
        ty: ty3,
      });
    });

    it(`The tx, ty of the transform is same with before when there is no input object.`, function () {
      const { transform: transform1, tx: tx1, ty: ty1 } = setupMockTransform();
      $$updateTranslateTransform(transform1);

      expectTransformWithTranslateTxTy({
        transform: transform1,
        tx: tx1,
        ty: ty1,
      });

      const { transform: transform2, tx: tx2, ty: ty2 } = setupMockTransform();
      $$updateTranslateTransform2()(transform2);

      expectTransformWithTranslateTxTy({
        transform: transform2,
        tx: tx2,
        ty: ty2,
      });

      const { transform: transform3, tx: tx3, ty: ty3 } = setupMockTransform();
      $$updateTranslateTransform3(undefined, transform3);

      expectTransformWithTranslateTxTy({
        transform: transform3,
        tx: tx3,
        ty: ty3,
      });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t1 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t1 = $$updateTranslateTransform(before_t1, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t2 = $$updateTranslateTransform2({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t3 = $$updateTranslateTransform3(
          {
            tx: makeRandomNumber(-100, 100),
            ty: makeRandomNumber(-100, 100),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });

      it(`When the transform is a rotate transform...`, function () {
        const before_t1 = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t1 = $$updateTranslateTransform(before_t1, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateTranslateTransform2({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateTranslateTransform3(
          {
            tx: makeRandomNumber(-100, 100),
            ty: makeRandomNumber(-100, 100),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });

      it(`When the transform is a scale transform...`, function () {
        const before_t1 = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t1 = $$updateTranslateTransform(before_t1, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateTranslateTransform2({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateTranslateTransform3(
          {
            tx: makeRandomNumber(-100, 100),
            ty: makeRandomNumber(-100, 100),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });
    });
  }),
];
