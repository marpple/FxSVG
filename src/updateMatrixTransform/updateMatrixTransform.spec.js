import { expect } from "chai";
import {
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$isMatrixSVGTransform } from "../isMatrixSVGTransform/isMatrixSVGTransform.index.js";
import {
  $$updateMatrixTransform,
  $$updateMatrixTransform2,
  $$updateMatrixTransform3,
} from "./updateMatrixTransform.index.js";

const setupMockTransform = () => {
  const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));
  const transform = $$createSVGTransformMatrix()({ matrix });
  return { transform, matrix };
};

const setupMockInputValues = () => ({
  matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
});

const expectTransformWithMatrix = ({ transform, matrix }) => {
  expect($$isMatrixSVGTransform(transform)).to.be.true;
  expect(transform.matrix).deep.equal(matrix);
};

export default ({ describe, it }) => [
  describe(`$$updateMatrixTransform`, function () {
    it(`The matrix of the input transform is changed to input matrix.`, function () {
      const { transform: transform1 } = setupMockTransform();
      const { matrix: matrix1 } = setupMockInputValues();
      $$updateMatrixTransform(transform1, { matrix: matrix1 });

      expectTransformWithMatrix({ transform: transform1, matrix: matrix1 });

      const { transform: transform2 } = setupMockTransform();
      const { matrix: matrix2 } = setupMockInputValues();
      $$updateMatrixTransform2({ matrix: matrix2 })(transform2);

      expectTransformWithMatrix({ transform: transform2, matrix: matrix2 });

      const { transform: transform3 } = setupMockTransform();
      const { matrix: matrix3 } = setupMockInputValues();
      $$updateMatrixTransform3({ matrix: matrix3 }, transform3);

      expectTransformWithMatrix({ transform: transform3, matrix: matrix3 });
    });

    it(`The matrix of the transform is same with before when there is no input matrix.`, function () {
      const { transform: transform1, matrix: matrix1 } = setupMockTransform();
      $$updateMatrixTransform(transform1, {});

      expectTransformWithMatrix({ transform: transform1, matrix: matrix1 });

      const { transform: transform2, matrix: matrix2 } = setupMockTransform();
      $$updateMatrixTransform2({})(transform2);

      expectTransformWithMatrix({ transform: transform2, matrix: matrix2 });

      const { transform: transform3, matrix: matrix3 } = setupMockTransform();
      $$updateMatrixTransform3({}, transform3);

      expectTransformWithMatrix({ transform: transform3, matrix: matrix3 });
    });

    it(`The matrix of the transform is same with before when there is no input object.`, function () {
      const { transform: transform1, matrix: matrix1 } = setupMockTransform();
      $$updateMatrixTransform(transform1);

      expectTransformWithMatrix({ transform: transform1, matrix: matrix1 });

      const { transform: transform2, matrix: matrix2 } = setupMockTransform();
      $$updateMatrixTransform2()(transform2);

      expectTransformWithMatrix({ transform: transform2, matrix: matrix2 });

      const { transform: transform3, matrix: matrix3 } = setupMockTransform();
      $$updateMatrixTransform3(undefined, transform3);

      expectTransformWithMatrix({ transform: transform3, matrix: matrix3 });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a translate transform...`, function () {
        const before_t1 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t1 = $$updateMatrixTransform(before_t1, {
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateMatrixTransform2({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateMatrixTransform3(
          {
            matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
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

        const after_t1 = $$updateMatrixTransform(before_t1, {
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateMatrixTransform2({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateMatrixTransform3(
          {
            matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
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

        const after_t1 = $$updateMatrixTransform(before_t1, {
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateMatrixTransform2({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateMatrixTransform3(
          {
            matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });
    });
  }),
];
