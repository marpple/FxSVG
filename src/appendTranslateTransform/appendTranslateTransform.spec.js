import chai from "chai";
import { mapL, rangeL } from "fxjs";
import { expectSameValueSVGTransform } from "../../test/assertions/index.js";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomSVGMatrix } from "../../test/utils/makeRandomSVGMatrix.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$appendTranslateTransform } from "./appendTranslateTransform.index.js";

const { expect } = chai;

const setupMock = ({
  tx = makeRandomInt(-100, 100),
  ty = makeRandomInt(-100, 100),
} = {}) => {
  const transform = $$createSVGTransformTranslate({ tx, ty })();
  return { transform, tx, ty };
};

export default ({ describe, it }) => [
  describe(`$$appendTranslateTransform`, function () {
    it(`The return value is the same reference with the input value.`, function () {
      const { transform: input } = setupMock();
      const [tx, ty] = mapL(() => makeRandomNumber(-100, 100), rangeL(2));

      const output = $$appendTranslateTransform({ tx, ty })(input);

      expect(output).equal(input);
    });

    it(`The transform's tx, ty is added with the input tx, ty.`, function () {
      const { transform, tx: prev_tx, ty: prev_ty } = setupMock();
      const [tx, ty] = mapL(() => makeRandomInt(-100, 100), rangeL(2));

      $$appendTranslateTransform({ tx, ty })(transform);

      expect(transform.matrix.e).equal(prev_tx + tx);
      expect(transform.matrix.f).equal(prev_ty + ty);
    });

    it(`The transform's tx will not change if no input tx.`, function () {
      const cases = [undefined, {}, { ty: makeRandomNumber(-100, 100) }];
      for (const input_obj of cases) {
        const { transform, tx } = setupMock();

        $$appendTranslateTransform(input_obj)(transform);

        expect(transform.matrix.e).equal(tx);
      }
    });

    it(`The transform's ty will not change if no input ty.`, function () {
      const cases = [undefined, {}, { tx: makeRandomNumber(-100, 100) }];
      for (const input_obj of cases) {
        const { transform, ty } = setupMock();

        $$appendTranslateTransform(input_obj)(transform);

        expect(transform.matrix.f).equal(ty);
      }
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t = $$createSVGTransformMatrix({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        })();
        const [tx, ty] = mapL(() => makeRandomNumber(-100, 100), rangeL(2));

        const after_t = $$appendTranslateTransform({ tx, ty })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });

      it(`When the transform is a rotate transform...`, function () {
        const before_t = $$createSVGTransformRotate({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        })();
        const [tx, ty] = mapL(() => makeRandomNumber(-100, 100), rangeL(2));

        const after_t = $$appendTranslateTransform({ tx, ty })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });

      it(`When the transform is a scale transform...`, function () {
        const before_t = $$createSVGTransformScale({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        })();
        const [tx, ty] = mapL(() => makeRandomNumber(-100, 100), rangeL(2));

        const after_t = $$appendTranslateTransform({ tx, ty })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });
    });
  }),
];
