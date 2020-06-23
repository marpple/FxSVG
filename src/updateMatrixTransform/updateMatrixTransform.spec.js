import { expect } from "chai";
import { go, go1, pick, tap } from "fxjs2";
import {
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateMatrixTransform } from "./updateMatrixTransform.index.js";

const setupMockTransform = () =>
  $$createSVGTransformMatrix()({
    matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
  });

const setupMockMatrix = () =>
  makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));

const setupMock = () => ({
  transform: setupMockTransform(),
  matrix: setupMockMatrix(),
});

export default ({ describe, it, beforeEach }) => [
  describe(`$$updateMatrixTransform`, function () {
    let t;

    beforeEach(function () {
      t = $$createSVGTransformMatrix()({ matrix: makeRandomSVGMatrix() });
    });

    it(`The matrix of the input transform is changed to input matrix.`, function () {
      const { transform, matrix } = setupMock();
      $$updateMatrixTransform(transform, { matrix });

      expect(transform.matrix).to.deep.equal(matrix);
    });

    it(`The matrix of transform is same with before when there is no input matrix`, function () {
      go1([undefined, {}], (input) =>
        go(
          setupMockTransform(),
          (transform) => ({
            transform,
            before_matrix_values: pick(
              ["a", "b", "c", "d", "e", "f"],
              transform.matrix
            ),
          }),
          tap(({ transform }) => $$updateMatrixTransform(transform, input)),
          ({ transform, before_matrix_values }) => ({
            before_matrix_values,
            after_matrix_values: pick(
              ["a", "b", "c", "d", "e", "f"],
              transform.matrix
            ),
          }),
          tap(({ before_matrix_values, after_matrix_values }) =>
            expect(after_matrix_values).to.deep.equal(before_matrix_values)
          )
        )
      );
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a translate transform...`, function () {
        const before_t = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t = $$updateMatrixTransform(before_t, {
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
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

        const after_t = $$updateMatrixTransform(before_t, {
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });

      it(`When the transform is a scale transform...`, function () {
        const before_t = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t = $$updateMatrixTransform(before_t, {
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });
    });
  }),
];
