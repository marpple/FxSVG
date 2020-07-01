import { expect } from "chai";
import { each, go, mapL, rangeL, takeL } from "fxjs2";
import {
  expectSameValueSVGTransform,
  expectTransformWithScaleSxSy,
} from "../../test/assertions/index.js";
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
      const [
        { transform: transform1 },
        { transform: transform2 },
        { transform: transform3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [
        { sx: sx1, sy: sy1 },
        { sx: sx2, sy: sy2 },
        { sx: sx3, sy: sy3 },
      ] = mapL(setupMockInputValues, rangeL(3));

      $$updateScaleTransform(transform1, { sx: sx1, sy: sy1 });
      $$updateScaleTransform2({ sx: sx2, sy: sy2 })(transform2);
      $$updateScaleTransform3({ sx: sx3, sy: sy3 }, transform3);
      // $$updateScaleTransform3({ sx: sx3, sy: sy3 })(transform3);

      each(
        ([transform, sx, sy]) =>
          expectTransformWithScaleSxSy({ transform, sx, sy }),
        [
          [transform1, sx1, sy1],
          [transform2, sx2, sy2],
          [transform3, sx3, sy3],
        ]
      );
    });

    it(`The sx of the transform is same with before when there is no input sx.`, function () {
      const [
        { transform: transform1, sx: sx1 },
        { transform: transform2, sx: sx2 },
        { transform: transform3, sx: sx3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [{ sy: sy1 }, { sy: sy2 }, { sy: sy3 }] = mapL(
        setupMockInputValues,
        rangeL(3)
      );

      $$updateScaleTransform(transform1, { sy: sy1 });
      $$updateScaleTransform2({ sy: sy2 })(transform2);
      $$updateScaleTransform3({ sy: sy3 }, transform3);
      // $$updateScaleTransform3({ sy: sy3 })(transform3);

      each(
        ([transform, sx, sy]) =>
          expectTransformWithScaleSxSy({ transform, sx, sy }),
        [
          [transform1, sx1, sy1],
          [transform2, sx2, sy2],
          [transform3, sx3, sy3],
        ]
      );
    });

    it(`The sy of the transform is same with before when there is no input sy.`, function () {
      const [
        { transform: transform1, sy: sy1 },
        { transform: transform2, sy: sy2 },
        { transform: transform3, sy: sy3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [{ sx: sx1 }, { sx: sx2 }, { sx: sx3 }] = mapL(
        setupMockInputValues,
        rangeL(3)
      );

      $$updateScaleTransform(transform1, { sx: sx1 });
      $$updateScaleTransform2({ sx: sx2 })(transform2);
      $$updateScaleTransform3({ sx: sx3 }, transform3);
      // $$updateScaleTransform3({ sx: sx3 })(transform3);

      each(
        ([transform, sx, sy]) =>
          expectTransformWithScaleSxSy({ transform, sx, sy }),
        [
          [transform1, sx1, sy1],
          [transform2, sx2, sy2],
          [transform3, sx3, sy3],
        ]
      );
    });

    it(`The sx, sy of the transform is same with before when there is no input object.`, function () {
      const [
        { transform: transform1, sx: sx1, sy: sy1 },
        { transform: transform2, sx: sx2, sy: sy2 },
        { transform: transform3, sx: sx3, sy: sy3 },
      ] = mapL(setupMockTransform, rangeL(3));

      $$updateScaleTransform(transform1);
      $$updateScaleTransform2()(transform2);
      $$updateScaleTransform3(undefined, transform2);
      // $$updateScaleTransform3()(transform2);

      each(
        ([transform, sx, sy]) =>
          expectTransformWithScaleSxSy({ transform, sx, sy }),
        [
          [transform1, sx1, sy1],
          [transform2, sx2, sy2],
          [transform3, sx3, sy3],
        ]
      );
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const [before_t1, before_t2, before_t3] = go(
          rangeL(3),
          mapL(() => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100))),
          mapL((matrix) => $$createSVGTransformMatrix({ matrix })())
        );

        const [[sx1, sy1], [sx2, sy2], [sx3, sy3]] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          (iter) =>
            mapL(() => [iter.next().value, iter.next().value], rangeL(Infinity))
        );

        const after_t1 = $$updateScaleTransform(before_t1, {
          sx: sx1,
          sy: sy1,
        });
        const after_t2 = $$updateScaleTransform2({
          sx: sx2,
          sy: sy2,
        })(before_t2);
        const after_t3 = $$updateScaleTransform3(
          { sx: sx3, sy: sy3 },
          before_t3
        );
        // const after_t3 = $$updateScaleTransform3({ sx: sx3, sy: sy3 })(
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

        const [[sx1, sy1], [sx2, sy2], [sx3, sy3]] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          (iter) =>
            mapL(() => [iter.next().value, iter.next().value], rangeL(Infinity))
        );

        const after_t1 = $$updateScaleTransform(before_t1, {
          sx: sx1,
          sy: sy1,
        });
        const after_t2 = $$updateScaleTransform2({
          sx: sx2,
          sy: sy2,
        })(before_t2);
        const after_t3 = $$updateScaleTransform3(
          { sx: sx3, sy: sy3 },
          before_t3
        );
        // const after_t3 = $$updateScaleTransform3({ sx: sx3, sy: sy3 })(
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

        const [[sx1, sy1], [sx2, sy2], [sx3, sy3]] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          (iter) =>
            mapL(() => [iter.next().value, iter.next().value], rangeL(Infinity))
        );

        const after_t1 = $$updateScaleTransform(before_t1, {
          sx: sx1,
          sy: sy1,
        });
        const after_t2 = $$updateScaleTransform2({
          sx: sx2,
          sy: sy2,
        })(before_t2);
        const after_t3 = $$updateScaleTransform3(
          { sx: sx3, sy: sy3 },
          before_t3
        );
        // const after_t3 = $$updateScaleTransform3({ sx: sx3, sy: sy3 })(
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
