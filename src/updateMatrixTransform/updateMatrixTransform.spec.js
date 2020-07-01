import { expect } from "chai";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import {
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateMatrixTransform } from "./updateMatrixTransform.index.js";

const setupMockTransform = () => {
  const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));
  const transform = $$createSVGTransformMatrix({ matrix })();
  return { transform, matrix };
};

const setupMockInputValues = () => ({
  matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
});

const expectTransformWithMatrix = ({
  transform: receive_transform,
  matrix,
}) => {
  const expect_transform = $$createSVGTransform();
  expect_transform.setMatrix(matrix);
  expectSameValueSVGTransform(
    receive_transform,
    expect_transform,
    "expectTransformWithMatrix"
  );
};

export default ({ describe, it }) => [
  describe(`$$updateMatrixTransform`, function () {
    it(`The matrix of the input transform is changed to input matrix.`, function () {
      const { transform } = setupMockTransform();
      const { matrix } = setupMockInputValues();

      $$updateMatrixTransform({ matrix })(transform);

      expectTransformWithMatrix({ transform, matrix });
    });

    it(`The matrix of the transform is same with before when there is no input matrix.`, function () {
      const { transform, matrix } = setupMockTransform();

      $$updateMatrixTransform({})(transform);

      expectTransformWithMatrix({ transform, matrix });
    });

    it(`The matrix of the transform is same with before when there is no input object.`, function () {
      const { transform, matrix } = setupMockTransform();

      $$updateMatrixTransform()(transform);

      expectTransformWithMatrix({ transform, matrix });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a translate transform...`, function () {
        const before_t = $$createSVGTransformTranslate({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        })();
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));

        const after_t = $$updateMatrixTransform({ matrix })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });

      it(`When the transform is a rotate transform...`, function () {
        const before_t = $$createSVGTransformRotate({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        })();
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));

        const after_t = $$updateMatrixTransform({ matrix })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });

      it(`When the transform is a scale transform...`, function () {
        const before_t = $$createSVGTransformScale({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        })();
        const matrix = makeRandomSVGMatrix(() => makeRandomNumber(-100, 100));

        const after_t = $$updateMatrixTransform({ matrix })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });
    });
  }),
];
