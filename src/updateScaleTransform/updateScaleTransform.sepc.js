import { expect } from "chai";
import { go, mapL, rangeL, tap } from "fxjs2";
import {
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$isScaleSVGTransform } from "../isScaleSVGTransform/isScaleSVGTransform.index.js";
import { $$updateScaleTransform } from "./updateScaleTransform.index.js";

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

const expectTransformWithSxSy = ({ transform, sx, sy }) => {
  const matrix = go(
    $$createSVGTransform(),
    tap((transform) => transform.setScale(sx, sy)),
    ({ matrix }) => matrix
  );

  expect($$isScaleSVGTransform(transform)).to.be.true;
  expect(transform.matrix).to.deep.equal(matrix);
};

export default ({ describe, it }) => [
  describe(`$$updateScaleTransform`, function () {
    it(`The sx, sy of the input transform is changed to input angle, sx, sy.`, function () {
      const { transform } = setupMockTransform();
      const { sx, sy } = setupMockInputValues();
      $$updateScaleTransform(transform, { sx, sy });

      expectTransformWithSxSy({ transform, sx, sy });
    });

    it(`The sx of the transform is same with before when there is no input sx.`, function () {
      const { transform, sx } = setupMockTransform();
      const { sy } = setupMockInputValues();
      $$updateScaleTransform(transform, { sy });

      expectTransformWithSxSy({ transform, sx, sy });
    });

    it(`The sy of the transform is same with before when there is no input sy.`, function () {
      const { transform, sy } = setupMockTransform();
      const { sx } = setupMockInputValues();
      $$updateScaleTransform(transform, { sx });

      expectTransformWithSxSy({ transform, sx, sy });
    });

    it(`The sx, sy of the transform is same with before when there is no input object.`, function () {
      const { transform, sx, sy } = setupMockTransform();
      $$updateScaleTransform(transform);

      expectTransformWithSxSy({ transform, sx, sy });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t = $$updateScaleTransform(before_t, {
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
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

        const after_t = $$updateScaleTransform(before_t, {
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });

      it(`When the transform is a translate transform...`, function () {
        const before_t = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t = $$updateScaleTransform(before_t, {
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });
    });
  }),
];
