import { expect } from "chai";
import { each, go, mapL, rangeL, takeL } from "fxjs2";
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
import {
  $$updateMatrixTransform,
  $$updateMatrixTransform2,
  $$updateMatrixTransform3,
} from "./updateMatrixTransform.index.js";

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
      const [
        { transform: transform1 },
        { transform: transform2 },
        { transform: transform3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [
        { matrix: matrix1 },
        { matrix: matrix2 },
        { matrix: matrix3 },
      ] = mapL(setupMockInputValues, rangeL(3));

      $$updateMatrixTransform(transform1, { matrix: matrix1 });
      $$updateMatrixTransform2({ matrix: matrix2 })(transform2);
      $$updateMatrixTransform3({ matrix: matrix3 }, transform3);
      // $$updateMatrixTransform3({ matrix: matrix3 })(transform3);

      each(
        ([transform, matrix]) =>
          expectTransformWithMatrix({ transform, matrix }),
        [
          [transform1, matrix1],
          [transform2, matrix2],
          [transform3, matrix3],
        ]
      );
    });

    it(`The matrix of the transform is same with before when there is no input matrix.`, function () {
      const [
        { transform: transform1, matrix: matrix1 },
        { transform: transform2, matrix: matrix2 },
        { transform: transform3, matrix: matrix3 },
      ] = mapL(setupMockTransform, rangeL(3));

      $$updateMatrixTransform(transform1, {});
      $$updateMatrixTransform2({})(transform2);
      $$updateMatrixTransform3({}, transform3);
      // $$updateMatrixTransform3({})(transform3);

      each(
        ([transform, matrix]) =>
          expectTransformWithMatrix({ transform, matrix }),
        [
          [transform1, matrix1],
          [transform2, matrix2],
          [transform3, matrix3],
        ]
      );
    });

    it(`The matrix of the transform is same with before when there is no input object.`, function () {
      const [
        { transform: transform1, matrix: matrix1 },
        { transform: transform2, matrix: matrix2 },
        { transform: transform3, matrix: matrix3 },
      ] = mapL(setupMockTransform, rangeL(3));

      $$updateMatrixTransform(transform1);
      $$updateMatrixTransform2()(transform2);
      $$updateMatrixTransform3(undefined, transform3);
      // $$updateMatrixTransform3()(transform3);

      each(
        ([transform, matrix]) =>
          expectTransformWithMatrix({ transform, matrix }),
        [
          [transform1, matrix1],
          [transform2, matrix2],
          [transform3, matrix3],
        ]
      );
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a translate transform...`, function () {
        const [before_t1, before_t2, before_t3] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          (iter) =>
            mapL(
              () => [iter.next().value, iter.next().value],
              rangeL(Infinity)
            ),
          mapL(([tx, ty]) => $$createSVGTransformTranslate()({ tx, ty })),
          takeL(3)
        );

        const [matrix1, matrix2, matrix3] = mapL(
          () => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
          rangeL(3)
        );

        const after_t1 = $$updateMatrixTransform(before_t1, {
          matrix: matrix1,
        });
        const after_t2 = $$updateMatrixTransform2({
          matrix: matrix2,
        })(before_t2);
        const after_t3 = $$updateMatrixTransform3(
          { matrix: matrix3 },
          before_t3
        );
        // const after_t3 = $$updateMatrixTransform3({ matrix: matrix3 })(
        //   before_t3
        // );

        each(
          ([before_t, after_t]) => {
            expect(after_t).to.equal(before_t);
            expectSameValueSVGTransform(after_t, before_t);
          },
          [
            [before_t1, after_t1],
            [before_t2, after_t2],
            [before_t3, after_t3],
          ]
        );
      });

      it(`When the transform is a rotate transform...`, function () {
        const [before_t1, before_t2, before_t3] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-700, 700)),
          (iter) =>
            mapL(
              () => [iter.next().value, iter.next().value, iter.next().value],
              rangeL(Infinity)
            ),
          mapL(([angle, cx, cy]) =>
            $$createSVGTransformRotate()({ angle, cx, cy })
          ),
          takeL(3)
        );

        const [matrix1, matrix2, matrix3] = mapL(
          () => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
          rangeL(3)
        );

        const after_t1 = $$updateMatrixTransform(before_t1, {
          matrix: matrix1,
        });
        const after_t2 = $$updateMatrixTransform2({
          matrix: matrix2,
        })(before_t2);
        const after_t3 = $$updateMatrixTransform3(
          { matrix: matrix3 },
          before_t3
        );
        // const after_t3 = $$updateMatrixTransform3({ matrix: matrix3 })(
        //   before_t3
        // );

        each(
          ([before_t, after_t]) => {
            expect(after_t).to.equal(before_t);
            expectSameValueSVGTransform(after_t, before_t);
          },
          [
            [before_t1, after_t1],
            [before_t2, after_t2],
            [before_t3, after_t3],
          ]
        );
      });

      it(`When the transform is a scale transform...`, function () {
        const [before_t1, before_t2, before_t3] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          (iter) =>
            mapL(
              () => [iter.next().value, iter.next().value],
              rangeL(Infinity)
            ),
          mapL(([sx, sy]) => $$createSVGTransformScale()({ sx, sy })),
          takeL(3)
        );

        const [matrix1, matrix2, matrix3] = mapL(
          () => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
          rangeL(3)
        );

        const after_t1 = $$updateMatrixTransform(before_t1, {
          matrix: matrix1,
        });
        const after_t2 = $$updateMatrixTransform2({
          matrix: matrix2,
        })(before_t2);
        const after_t3 = $$updateMatrixTransform3(
          { matrix: matrix3 },
          before_t3
        );
        // const after_t3 = $$updateMatrixTransform3({ matrix: matrix3 })(
        //   before_t3
        // );

        each(
          ([before_t, after_t]) => {
            expect(after_t).to.equal(before_t);
            expectSameValueSVGTransform(after_t, before_t);
          },
          [
            [before_t1, after_t1],
            [before_t2, after_t2],
            [before_t3, after_t3],
          ]
        );
      });
    });
  }),
];
