import chai from "chai";
import { equals2, go, mapL, rangeL, rejectL, takeL } from "fxjs/es";
import { expectSameValueSVGTransform } from "../../test/assertions/expectSameValueSVGTransform.js";
import {
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$appendRotateTransform } from "./appendRotateTransform.index.js";

const { expect } = chai;

const setupMock = ({
  angle = makeRandomInt(-700, 700),
  cx = makeRandomNumber(-100, 100),
  cy = makeRandomNumber(-100, 100),
} = {}) => {
  const transform = $$createSVGTransformRotate({ angle, cx, cy })();
  return { transform, angle, cx, cy };
};

export default ({ describe, it }) => [
  describe(`$$appendRotateTransform`, function () {
    it(`The return value is the same reference with the input value.`, function () {
      const { transform: input } = setupMock();
      const angle = makeRandomNumber(-700, 700);

      const output = $$appendRotateTransform({ angle })(input);

      expect(output).equal(input);
    });

    it(`The transform's angle is added with the input angle.`, function () {
      const { transform, angle: prev_angle } = setupMock();
      const angle = makeRandomInt(-700, 700);

      $$appendRotateTransform({ angle })(transform);

      expect(transform.angle).equal(prev_angle + angle);
    });

    it(`The transform's angle will not change if no input angle.`, function () {
      for (const input_obj of [undefined, {}]) {
        const { transform, angle } = setupMock();

        $$appendRotateTransform(input_obj)(transform);

        expect(transform.angle).equal(angle);
      }
    });

    it(`The transform's cx, cy will be 0.`, function () {
      const { transform } = go(
        rangeL(Infinity),
        mapL(() => makeRandomNumber(-100, 100)),
        rejectL(equals2(0)),
        takeL(2),
        ([cx, cy]) => setupMock({ cx, cy })
      );
      const angle = makeRandomInt(-700, 700);

      $$appendRotateTransform({ angle })(transform);

      expect(transform.matrix.e).equal(0);
      expect(transform.matrix.f).equal(0);
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t = $$createSVGTransformMatrix({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        })();
        const angle = makeRandomNumber(-700, 700);

        const after_t = $$appendRotateTransform({ angle })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });

      it(`When the transform is a scale transform...`, function () {
        const before_t = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          takeL(2),
          ([sx, sy]) => $$createSVGTransformScale({ sx, sy })()
        );
        const angle = makeRandomNumber(-700, 700);

        const after_t = $$appendRotateTransform({ angle })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });

      it(`When the transform is a translate transform...`, function () {
        const before_t = go(
          rangeL(Infinity),
          mapL(() => makeRandomNumber(-100, 100)),
          takeL(2),
          ([tx, ty]) => $$createSVGTransformTranslate({ tx, ty })()
        );
        const angle = makeRandomNumber(-700, 700);

        const after_t = $$appendRotateTransform({ angle })(before_t);

        expect(after_t).equal(before_t);
        expectSameValueSVGTransform(after_t, before_t);
      });
    });
  }),
];
