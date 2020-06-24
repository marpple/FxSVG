import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomSVGMatrix } from "../../test/utils/makeRandomSVGMatrix.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$appendTranslateTransform } from "./appendTranslateTransform.index.js";

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
      const { transform: input } = setupMock();
      const [tx, ty] = mapL(() => makeRandomNumber(-100, 100), rangeL(2));

      const output = $$appendTranslateTransform(input, { tx, ty });

      expect(output).to.equal(input);
    });

    it(`The transform's tx, ty is added with the input tx, ty.`, function () {
      const { transform, tx: prev_tx, ty: prev_ty } = setupMock();
      const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));

      $$appendTranslateTransform(transform, { tx, ty });

      expect(transform.matrix.e).to.equal(prev_tx + tx);
      expect(transform.matrix.f).to.equal(prev_ty + ty);
    });

    it(`The transform's tx will not change if no input tx.`, function () {
      const option_cases = [undefined, {}, { ty: makeRandomNumber(-100, 100) }];
      for (const option of option_cases) {
        const { transform, tx } = setupMock();

        $$appendTranslateTransform(transform, option);

        expect(transform.matrix.e).to.equal(tx);
      }
    });

    it(`The transform's ty will not change if no input ty.`, function () {
      const option_cases = [undefined, {}, { tx: makeRandomNumber(-100, 100) }];
      for (const option of option_cases) {
        const { transform, ty } = setupMock();

        $$appendTranslateTransform(transform, option);

        expect(transform.matrix.f).to.equal(ty);
      }
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t = $$appendTranslateTransform(before_t, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t.matrix).to.deep.equal(before_t.matrix);
      });

      it(`When the transform is a rotate transform...`, function () {
        const before_t = $$createSVGTransformRotate()({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        const after_t = $$appendTranslateTransform(before_t, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t.matrix).to.deep.equal(before_t.matrix);
      });

      it(`When the transform is a scale transform...`, function () {
        const before_t = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t = $$appendTranslateTransform(before_t, {
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t.matrix).to.deep.equal(before_t.matrix);
      });
    });
  }),
];
