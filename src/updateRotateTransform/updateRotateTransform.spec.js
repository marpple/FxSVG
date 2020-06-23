import { expect } from "chai";
import { go, mapL, rangeL, tap } from "fxjs2";
import {
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransform } from "../createSVGTransform/createSVGTransform.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateRotateTransform } from "./updateRotateTransform.index.js";

const setupMockTransform = () => {
  const angle = makeRandomInt(-700, 700);
  const [cx, cy] = mapL(() => makeRandomInt(-100, 100), rangeL(2));
  return {
    transform: $$createSVGTransformRotate()({
      angle,
      cx,
      cy,
    }),
    angle,
    cx,
    cy,
  };
};

const setupMockInputValues = () => ({
  angle: makeRandomInt(-700, 700),
  cx: makeRandomInt(-100, 100),
  cy: makeRandomInt(-100, 100),
});

const expectTransformWithAngleCxCy = ({ transform, angle, cx, cy }) => {
  const matrix = go(
    $$createSVGTransform(),
    tap((transform) => transform.setRotate(angle, cx, cy)),
    ({ matrix }) => matrix
  );

  expect(transform.angle).to.equal(angle);
  expect(transform.matrix).to.deep.equal(matrix);
};

export default ({ describe, it }) => [
  describe(`$$updateRotateTransform`, function () {
    it(`The angle, cx, cy of the input transform is changed to input angle, cx, cy.`, function () {
      const { transform } = setupMockTransform();
      const { angle, cx, cy } = setupMockInputValues();
      $$updateRotateTransform(transform, { angle, cx, cy });

      expectTransformWithAngleCxCy({ transform, angle, cx, cy });
    });

    it(`The angle of the transform is same with before when there is no input angle.`, function () {
      const { transform, angle } = setupMockTransform();
      const { cx, cy } = setupMockInputValues();
      $$updateRotateTransform(transform, { cx, cy });

      expectTransformWithAngleCxCy({ transform, angle, cx, cy });
    });

    it(`The cx, cy of the transform is 0 when there is no input cx, cy.`, function () {
      const { transform } = setupMockTransform();
      const { angle } = setupMockInputValues();
      $$updateRotateTransform(transform, { angle });

      expectTransformWithAngleCxCy({ transform, angle, cx: 0, cy: 0 });
    });

    it(`The angle of the transform is same with before and the cx, cy of the transform is 0
        when there is no input object.`, function () {
      const { transform, angle } = setupMockTransform();
      $$updateRotateTransform(transform);

      expectTransformWithAngleCxCy({ transform, angle, cx: 0, cy: 0 });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t = $$updateRotateTransform(before_t, {
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });

      it(`When the transform in a scale transform...`, function () {
        const before_t = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t = $$updateRotateTransform(before_t, {
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });

      it(`When the transform is a translate transform...`, function () {
        const before_t = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t = $$updateRotateTransform(before_t, {
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        expect(after_t).to.equal(before_t);
        expect(after_t).to.deep.equal(before_t);
      });
    });
  }),
];
