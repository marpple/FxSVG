import { expect } from "chai";
import { each, go, mapL, rangeL, zipL } from "fxjs2";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomSVGMatrix } from "../../test/utils/makeRandomSVGMatrix.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import {
  $$appendTranslateTransform,
  $$appendTranslateTransform2,
  $$appendTranslateTransform3,
} from "./appendTranslateTransform.index.js";

const setupMock = ({
  tx = makeRandomInt(-100, 100),
  ty = makeRandomInt(-100, 100),
} = {}) => {
  const transform = $$createSVGTransformTranslate()({ tx, ty });
  return { transform, tx, ty };
};

export default ({ describe, it }) => [
  describe(`$$appendTranslateTransform`, function () {
    it(`The return value is the same reference with the input value.`, function () {
      const [
        { transform: input1 },
        { transform: input2 },
        { transform: input3 },
      ] = mapL(() => setupMock(), rangeL(3));
      const [[tx1, ty1], [tx2, ty2], [tx3, ty3]] = mapL(
        () => mapL(() => makeRandomNumber(-100, 100), rangeL(2)),
        rangeL(3)
      );

      const output1 = $$appendTranslateTransform(input1, { tx: tx1, ty: ty1 });
      const output2 = $$appendTranslateTransform2({ tx: tx2, ty: ty2 })(input2);
      const output3 = $$appendTranslateTransform3({ tx: tx3, ty: ty3 }, input3);
      // const output3 = $$appendTranslateTransform3({ tx: tx3, ty: ty3 })(input3);

      go(
        [output1, output2, output3],
        zipL([input1, input2, input3]),
        each(([input, output]) => expect(output).equal(input))
      );
    });

    it(`The transform's tx, ty is added with the input tx, ty.`, function () {
      const [
        { transform: transform1, tx: prev_tx1, ty: prev_ty1 },
        { transform: transform2, tx: prev_tx2, ty: prev_ty2 },
        { transform: transform3, tx: prev_tx3, ty: prev_ty3 },
      ] = mapL(() => setupMock(), rangeL(3));
      const [[tx1, ty1], [tx2, ty2], [tx3, ty3]] = mapL(
        () => mapL(() => makeRandomInt(-100, 100), rangeL(2)),
        rangeL(3)
      );

      $$appendTranslateTransform(transform1, { tx: tx1, ty: ty1 });
      $$appendTranslateTransform2({ tx: tx2, ty: ty2 })(transform2);
      $$appendTranslateTransform3({ tx: tx3, ty: ty3 }, transform3);
      // $$appendTranslateTransform3({ tx: tx3, ty: ty3 })(transform3);

      each(
        ([transform, prev_tx, prev_ty, tx, ty]) => {
          expect(transform.matrix.e).to.equal(prev_tx + tx);
          expect(transform.matrix.f).to.equal(prev_ty + ty);
        },
        [
          [transform1, prev_tx1, prev_ty1, tx1, ty1],
          [transform2, prev_tx2, prev_ty2, tx2, ty2],
          [transform3, prev_tx3, prev_ty3, tx3, ty3],
        ]
      );
    });

    it(`The transform's tx will not change if no input tx.`, function () {
      const option_cases = go(
        rangeL(3),
        mapL(() => [undefined, {}, { ty: makeRandomNumber(-100, 100) }]),
        (iterables) => zipL(...iterables)
      );
      for (const [option1, option2, option3] of option_cases) {
        const [
          { transform: transform1, tx: tx1 },
          { transform: transform2, tx: tx2 },
          { transform: transform3, tx: tx3 },
        ] = mapL(() => setupMock(), rangeL(3));

        $$appendTranslateTransform(transform1, option1);
        $$appendTranslateTransform2(option2)(transform2);
        $$appendTranslateTransform3(option3, transform3);
        // $$appendTranslateTransform3(option3)(transform3);

        each(([transform, tx]) => expect(transform.matrix.e).equal(tx), [
          [transform1, tx1],
          [transform2, tx2],
          [transform3, tx3],
        ]);
      }
    });

    it(`The transform's ty will not change if no input ty.`, function () {
      const option_cases = go(
        rangeL(3),
        mapL(() => [undefined, {}, { tx: makeRandomNumber(-100, 100) }]),
        (iterables) => zipL(...iterables)
      );
      for (const [option1, option2, option3] of option_cases) {
        const [
          { transform: transform1, ty: ty1 },
          { transform: transform2, ty: ty2 },
          { transform: transform3, ty: ty3 },
        ] = mapL(() => setupMock(), rangeL(3));

        $$appendTranslateTransform(transform1, option1);
        $$appendTranslateTransform2(option2)(transform2);
        $$appendTranslateTransform3(option3, transform3);
        // $$appendTranslateTransform3(option3)(transform3);

        each(([transform, ty]) => expect(transform.matrix.f).equal(ty), [
          [transform1, ty1],
          [transform2, ty2],
          [transform3, ty3],
        ]);
      }
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const [before_t1, before_t2, before_t3] = go(
          rangeL(3),
          mapL(() => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100))),
          mapL((matrix) => $$createSVGTransformMatrix({ matrix })())
        );

        const [[tx1, ty1], [tx2, ty2], [tx3, ty3]] = mapL(
          () => mapL(() => makeRandomNumber(-100, 100), rangeL(2)),
          rangeL(3)
        );

        const after_t1 = $$appendTranslateTransform(before_t1, {
          tx: tx1,
          ty: ty1,
        });
        const after_t2 = $$appendTranslateTransform2({
          tx: tx2,
          ty: ty2,
        })(before_t2);
        const after_t3 = $$appendTranslateTransform3(
          {
            tx: tx3,
            ty: ty3,
          },
          before_t3
        );
        // const after_t3 = $$appendTranslateTransform3({
        //   tx: tx3,
        //   ty: ty3,
        // })(before_t3);

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
          rangeL(3),
          mapL(() => ({
            angle: makeRandomNumber(-700, 700),
            cx: makeRandomNumber(-100, 100),
            cy: makeRandomNumber(-100, 100),
          })),
          mapL((option) => $$createSVGTransformRotate(option)())
        );

        const [[tx1, ty1], [tx2, ty2], [tx3, ty3]] = mapL(
          () => mapL(() => makeRandomNumber(-100, 100), rangeL(2)),
          rangeL(3)
        );

        const after_t1 = $$appendTranslateTransform(before_t1, {
          tx: tx1,
          ty: ty1,
        });
        const after_t2 = $$appendTranslateTransform2({
          tx: tx2,
          ty: ty2,
        })(before_t2);
        const after_t3 = $$appendTranslateTransform3(
          {
            tx: tx3,
            ty: ty3,
          },
          before_t3
        );
        // const after_t3 = $$appendTranslateTransform3({
        //   tx: tx3,
        //   ty: ty3,
        // })(before_t3);

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
          rangeL(3),
          mapL(() => ({
            sx: makeRandomNumber(-100, 100),
            sy: makeRandomNumber(-100, 100),
          })),
          mapL((option) => $$createSVGTransformScale()(option))
        );

        const [[tx1, ty1], [tx2, ty2], [tx3, ty3]] = mapL(
          () => mapL(() => makeRandomNumber(-100, 100), rangeL(2)),
          rangeL(3)
        );

        const after_t1 = $$appendTranslateTransform(before_t1, {
          tx: tx1,
          ty: ty1,
        });
        const after_t2 = $$appendTranslateTransform2({
          tx: tx2,
          ty: ty2,
        })(before_t2);
        const after_t3 = $$appendTranslateTransform3(
          {
            tx: tx3,
            ty: ty3,
          },
          before_t3
        );
        // const after_t3 = $$appendTranslateTransform3({
        //   tx: tx3,
        //   ty: ty3,
        // })(before_t3);

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
