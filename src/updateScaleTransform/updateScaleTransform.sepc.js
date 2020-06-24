import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { expectTransformWithScaleSxSy } from "../../test/assertions/index.js";
import {
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import {
  $$updateScaleTransform,
  $$updateScaleTransform2,
  $$updateScaleTransform3,
} from "./updateScaleTransform.index.js";

const setupMockTransform = () => {
  const [sx, sy] = mapL(() => makeRandomNumber(-100, 100), rangeL(2));
  return {
    transform: $$createSVGTransformScale()({ sx, sy }),
    sx,
    sy,
  };
};

const setupMockInputValues = () => ({
  sx: makeRandomNumber(-100, 100),
  sy: makeRandomNumber(-100, 100),
});

export default ({ describe, it }) => [
  describe(`$$updateScaleTransform`, function () {
    it(`The sx, sy of the input transform is changed to input angle, sx, sy.`, function () {
      const { transform: transform1 } = setupMockTransform();
      const { sx: sx1, sy: sy1 } = setupMockInputValues();
      $$updateScaleTransform(transform1, { sx: sx1, sy: sy1 });

      expectTransformWithScaleSxSy({ transform: transform1, sx: sx1, sy: sy1 });

      const { transform: transform2 } = setupMockTransform();
      const { sx: sx2, sy: sy2 } = setupMockInputValues();
      $$updateScaleTransform2({ sx: sx2, sy: sy2 })(transform2);

      expectTransformWithScaleSxSy({ transform: transform2, sx: sx2, sy: sy2 });

      const { transform: transform3 } = setupMockTransform();
      const { sx: sx3, sy: sy3 } = setupMockInputValues();
      $$updateScaleTransform3({ sx: sx3, sy: sy3 }, transform3);

      expectTransformWithScaleSxSy({ transform: transform3, sx: sx3, sy: sy3 });
    });

    it(`The sx of the transform is same with before when there is no input sx.`, function () {
      const { transform: transform1, sx: sx1 } = setupMockTransform();
      const { sy: sy1 } = setupMockInputValues();
      $$updateScaleTransform(transform1, { sy: sy1 });

      expectTransformWithScaleSxSy({ transform: transform1, sx: sx1, sy: sy1 });

      const { transform: transform2, sx: sx2 } = setupMockTransform();
      const { sy: sy2 } = setupMockInputValues();
      $$updateScaleTransform2({ sy: sy2 })(transform2);

      expectTransformWithScaleSxSy({ transform: transform2, sx: sx2, sy: sy2 });

      const { transform: transform3, sx: sx3 } = setupMockTransform();
      const { sy: sy3 } = setupMockInputValues();
      $$updateScaleTransform3({ sy: sy3 }, transform3);

      expectTransformWithScaleSxSy({ transform: transform3, sx: sx3, sy: sy3 });
    });

    it(`The sy of the transform is same with before when there is no input sy.`, function () {
      const { transform: transform1, sy: sy1 } = setupMockTransform();
      const { sx: sx1 } = setupMockInputValues();
      $$updateScaleTransform(transform1, { sx: sx1 });

      expectTransformWithScaleSxSy({ transform: transform1, sx: sx1, sy: sy1 });

      const { transform: transform2, sy: sy2 } = setupMockTransform();
      const { sx: sx2 } = setupMockInputValues();
      $$updateScaleTransform2({ sx: sx2 })(transform2);

      expectTransformWithScaleSxSy({ transform: transform2, sx: sx2, sy: sy2 });

      const { transform: transform3, sy: sy3 } = setupMockTransform();
      const { sx: sx3 } = setupMockInputValues();
      $$updateScaleTransform3({ sx: sx3 }, transform3);

      expectTransformWithScaleSxSy({ transform: transform3, sx: sx3, sy: sy3 });
    });

    it(`The sx, sy of the transform is same with before when there is no input object.`, function () {
      const { transform: transform1, sx: sx1, sy: sy1 } = setupMockTransform();
      $$updateScaleTransform(transform1);

      expectTransformWithScaleSxSy({ transform: transform1, sx: sx1, sy: sy1 });

      const { transform: transform2, sx: sx2, sy: sy2 } = setupMockTransform();
      $$updateScaleTransform2()(transform2);

      expectTransformWithScaleSxSy({ transform: transform2, sx: sx2, sy: sy2 });

      const { transform: transform3, sx: sx3, sy: sy3 } = setupMockTransform();
      $$updateScaleTransform3(undefined, transform2);

      expectTransformWithScaleSxSy({ transform: transform3, sx: sx3, sy: sy3 });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t1 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t1 = $$updateScaleTransform(before_t1, {
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t2 = $$updateScaleTransform2({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t3 = $$updateScaleTransform3(
          {
            sx: makeRandomNumber(-100, 100),
            sy: makeRandomNumber(-100, 100),
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

        const after_t1 = $$updateScaleTransform(before_t1, {
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateScaleTransform2({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateScaleTransform3(
          {
            sx: makeRandomNumber(-100, 100),
            sy: makeRandomNumber(-100, 100),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });

      it(`When the transform is a translate transform...`, function () {
        const before_t1 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t1 = $$updateScaleTransform(before_t1, {
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateScaleTransform2({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateScaleTransform3(
          {
            sx: makeRandomNumber(-100, 100),
            sy: makeRandomNumber(-100, 100),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });
    });
  }),
];
