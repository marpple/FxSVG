import { expect } from "chai";
import { each, go, mapL, rangeL, takeL } from "fxjs2";
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
import {
  $$updateTranslateTransform,
  $$updateTranslateTransform2,
  $$updateTranslateTransform3,
} from "./updateTranslateTransform.index.js";

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
      const [
        { transform: transform1 },
        { transform: transform2 },
        { transform: transform3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [
        { tx: tx1, ty: ty1 },
        { tx: tx2, ty: ty2 },
        { tx: tx3, ty: ty3 },
      ] = mapL(setupMockInputValues, rangeL(3));

      $$updateTranslateTransform(transform1, { tx: tx1, ty: ty1 });
      $$updateTranslateTransform2({ tx: tx2, ty: ty2 })(transform2);
      $$updateTranslateTransform3({ tx: tx3, ty: ty3 }, transform3);
      // $$updateTranslateTransform3({ tx: tx3, ty: ty3 })(transform3);

      each(
        ([transform, tx, ty]) =>
          expectTransformWithTranslateTxTy({ transform, tx, ty }),
        [
          [transform1, tx1, ty1],
          [transform2, tx2, ty2],
          [transform3, tx3, ty3],
        ]
      );
    });

    it(`The tx of the transform is same with before when there is no input tx.`, function () {
      const [
        { transform: transform1, tx: tx1 },
        { transform: transform2, tx: tx2 },
        { transform: transform3, tx: tx3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [{ ty: ty1 }, { ty: ty2 }, { ty: ty3 }] = mapL(
        setupMockInputValues,
        rangeL(3)
      );

      $$updateTranslateTransform(transform1, { ty: ty1 });
      $$updateTranslateTransform2({ ty: ty2 })(transform2);
      $$updateTranslateTransform3({ ty: ty3 }, transform3);
      // $$updateTranslateTransform3({ ty: ty3 })(transform3);

      each(
        ([transform, tx, ty]) =>
          expectTransformWithTranslateTxTy({ transform, tx, ty }),
        [
          [transform1, tx1, ty1],
          [transform2, tx2, ty2],
          [transform3, tx3, ty3],
        ]
      );
    });

    it(`The ty of the transform is same with before when there is no input ty.`, function () {
      const [
        { transform: transform1, ty: ty1 },
        { transform: transform2, ty: ty2 },
        { transform: transform3, ty: ty3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [{ tx: tx1 }, { tx: tx2 }, { tx: tx3 }] = mapL(
        setupMockInputValues,
        rangeL(3)
      );

      $$updateTranslateTransform(transform1, { tx: tx1 });
      $$updateTranslateTransform2({ tx: tx2 })(transform2);
      $$updateTranslateTransform3({ tx: tx3 }, transform3);
      // $$updateTranslateTransform3({ tx: tx3 })(transform3);

      each(
        ([transform, tx, ty]) =>
          expectTransformWithTranslateTxTy({ transform, tx, ty }),
        [
          [transform1, tx1, ty1],
          [transform2, tx2, ty2],
          [transform3, tx3, ty3],
        ]
      );
    });

    it(`The tx, ty of the transform is same with before when there is no input object.`, function () {
      const [
        { transform: transform1, tx: tx1, ty: ty1 },
        { transform: transform2, tx: tx2, ty: ty2 },
        { transform: transform3, tx: tx3, ty: ty3 },
      ] = mapL(setupMockTransform, rangeL(3));

      $$updateTranslateTransform(transform1);
      $$updateTranslateTransform2()(transform2);
      $$updateTranslateTransform3(undefined, transform3);
      // $$updateTranslateTransform3()(transform3);

      each(
        ([transform, tx, ty]) =>
          expectTransformWithTranslateTxTy({ transform, tx, ty }),
        [
          [transform1, tx1, ty1],
          [transform2, tx2, ty2],
          [transform3, tx3, ty3],
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

        const [[tx1, ty1], [tx2, ty2], [tx3, ty3]] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          (iter) =>
            mapL(() => [iter.next().value, iter.next().value], rangeL(Infinity))
        );

        const after_t1 = $$updateTranslateTransform(before_t1, {
          tx: tx1,
          ty: ty1,
        });
        const after_t2 = $$updateTranslateTransform2({
          tx: tx2,
          ty: ty2,
        })(before_t2);
        const after_t3 = $$updateTranslateTransform3(
          { tx: tx3, ty: ty3 },
          before_t3
        );
        // const after_t3 = $$updateTranslateTransform3({ tx: tx3, ty: ty3 })(
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
            $$createSVGTransformRotate({ angle, cx, cy })()
          ),
          takeL(3)
        );

        const [[tx1, ty1], [tx2, ty2], [tx3, ty3]] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          (iter) =>
            mapL(() => [iter.next().value, iter.next().value], rangeL(Infinity))
        );

        const after_t1 = $$updateTranslateTransform(before_t1, {
          tx: tx1,
          ty: ty1,
        });
        const after_t2 = $$updateTranslateTransform2({
          tx: tx2,
          ty: ty2,
        })(before_t2);
        const after_t3 = $$updateTranslateTransform3(
          { tx: tx3, ty: ty3 },
          before_t3
        );
        // const after_t3 = $$updateTranslateTransform3({ tx: tx3, ty: ty3 })(
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
          mapL(([sx, sy]) => $$createSVGTransformScale({ sx, sy })()),
          takeL(3)
        );

        const [[tx1, ty1], [tx2, ty2], [tx3, ty3]] = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          (iter) =>
            mapL(() => [iter.next().value, iter.next().value], rangeL(Infinity))
        );

        const after_t1 = $$updateTranslateTransform(before_t1, {
          tx: tx1,
          ty: ty1,
        });
        const after_t2 = $$updateTranslateTransform2({
          tx: tx2,
          ty: ty2,
        })(before_t2);
        const after_t3 = $$updateTranslateTransform3(
          { tx: tx3, ty: ty3 },
          before_t3
        );
        // const after_t3 = $$updateTranslateTransform3({ tx: tx3, ty: ty3 })(
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
