import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { expectTransformWithRotateAngleCxCy } from "../../test/assertions/index.js";
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
  $$updateRotateTransform,
  $$updateRotateTransform2,
  $$updateRotateTransform3,
} from "./updateRotateTransform.index.js";

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

export default ({ describe, it }) => [
  describe(`$$updateRotateTransform`, function () {
    it(`The angle, cx, cy of the input transform is changed to input angle, cx, cy.`, function () {
      const { transform: transform1 } = setupMockTransform();
      const { angle: angle1, cx: cx1, cy: cy1 } = setupMockInputValues();
      $$updateRotateTransform(transform1, { angle: angle1, cx: cx1, cy: cy1 });

      expectTransformWithRotateAngleCxCy({
        transform: transform1,
        angle: angle1,
        cx: cx1,
        cy: cy1,
      });

      const { transform: transform2 } = setupMockTransform();
      const { angle: angle2, cx: cx2, cy: cy2 } = setupMockInputValues();
      $$updateRotateTransform2({ angle: angle2, cx: cx2, cy: cy2 })(transform2);

      expectTransformWithRotateAngleCxCy({
        transform: transform2,
        angle: angle2,
        cx: cx2,
        cy: cy2,
      });

      const { transform: transform3 } = setupMockTransform();
      const { angle: angle3, cx: cx3, cy: cy3 } = setupMockInputValues();
      $$updateRotateTransform3({ angle: angle3, cx: cx3, cy: cy3 }, transform3);

      expectTransformWithRotateAngleCxCy({
        transform: transform3,
        angle: angle3,
        cx: cx3,
        cy: cy3,
      });
    });

    it(`The angle of the transform is same with before when there is no input angle.`, function () {
      const { transform: transform1, angle: angle1 } = setupMockTransform();
      const { cx: cx1, cy: cy1 } = setupMockInputValues();
      $$updateRotateTransform(transform1, { cx: cx1, cy: cy1 });

      expectTransformWithRotateAngleCxCy({
        transform: transform1,
        angle: angle1,
        cx: cx1,
        cy: cy1,
      });

      const { transform: transform2, angle: angle2 } = setupMockTransform();
      const { cx: cx2, cy: cy2 } = setupMockInputValues();
      $$updateRotateTransform2({ cx: cx2, cy: cy2 })(transform2);

      expectTransformWithRotateAngleCxCy({
        transform: transform2,
        angle: angle2,
        cx: cx2,
        cy: cy2,
      });

      const { transform: transform3, angle: angle3 } = setupMockTransform();
      const { cx: cx3, cy: cy3 } = setupMockInputValues();
      $$updateRotateTransform3({ cx: cx3, cy: cy3 }, transform3);

      expectTransformWithRotateAngleCxCy({
        transform: transform3,
        angle: angle3,
        cx: cx3,
        cy: cy3,
      });
    });

    it(`The cx, cy of the transform is 0 when there is no input cx, cy.`, function () {
      const { transform: transform1 } = setupMockTransform();
      const { angle: angle1 } = setupMockInputValues();
      $$updateRotateTransform(transform1, { angle: angle1 });

      expectTransformWithRotateAngleCxCy({
        transform: transform1,
        angle: angle1,
        cx: 0,
        cy: 0,
      });

      const { transform: transform2 } = setupMockTransform();
      const { angle: angle2 } = setupMockInputValues();
      $$updateRotateTransform2({ angle: angle2 })(transform2);

      expectTransformWithRotateAngleCxCy({
        transform: transform2,
        angle: angle2,
        cx: 0,
        cy: 0,
      });

      const { transform: transform3 } = setupMockTransform();
      const { angle: angle3 } = setupMockInputValues();
      $$updateRotateTransform3({ angle: angle3 }, transform3);

      expectTransformWithRotateAngleCxCy({
        transform: transform3,
        angle: angle3,
        cx: 0,
        cy: 0,
      });
    });

    it(`The angle of the transform is same with before and the cx, cy of the transform is 0
        when there is no input object.`, function () {
      const { transform: transform1, angle: angle1 } = setupMockTransform();
      $$updateRotateTransform(transform1);

      expectTransformWithRotateAngleCxCy({
        transform: transform1,
        angle: angle1,
        cx: 0,
        cy: 0,
      });

      const { transform: transform2, angle: angle2 } = setupMockTransform();
      $$updateRotateTransform2()(transform2);

      expectTransformWithRotateAngleCxCy({
        transform: transform2,
        angle: angle2,
        cx: 0,
        cy: 0,
      });

      const { transform: transform3, angle: angle3 } = setupMockTransform();
      $$updateRotateTransform3(undefined, transform3);

      expectTransformWithRotateAngleCxCy({
        transform: transform3,
        angle: angle3,
        cx: 0,
        cy: 0,
      });
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const before_t1 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t1 = $$updateRotateTransform(before_t1, {
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t2 = $$updateRotateTransform2({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformMatrix()({
          matrix: makeRandomSVGMatrix(() => makeRandomNumber(-100, 100)),
        });

        const after_t3 = $$updateRotateTransform3(
          {
            angle: makeRandomNumber(-700, 700),
            cx: makeRandomNumber(-100, 100),
            cy: makeRandomNumber(-100, 100),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });

      it(`When the transform in a scale transform...`, function () {
        const before_t1 = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t1 = $$updateRotateTransform(before_t1, {
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateRotateTransform2({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformScale()({
          sx: makeRandomNumber(-100, 100),
          sy: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateRotateTransform3(
          {
            angle: makeRandomNumber(-700, 700),
            cx: makeRandomNumber(-100, 100),
            cy: makeRandomNumber(-100, 100),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });

      it(`When the transform is a translate transform...`, function () {
        const before_t1 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t1 = $$updateRotateTransform(before_t1, {
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        });

        expect(after_t1).to.equal(before_t1);
        expect(after_t1).to.deep.equal(before_t1);

        const before_t2 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t2 = $$updateRotateTransform2({
          angle: makeRandomNumber(-700, 700),
          cx: makeRandomNumber(-100, 100),
          cy: makeRandomNumber(-100, 100),
        })(before_t2);

        expect(after_t2).to.equal(before_t2);
        expect(after_t2).to.deep.equal(before_t2);

        const before_t3 = $$createSVGTransformTranslate()({
          tx: makeRandomNumber(-100, 100),
          ty: makeRandomNumber(-100, 100),
        });

        const after_t3 = $$updateRotateTransform3(
          {
            angle: makeRandomNumber(-700, 700),
            cx: makeRandomNumber(-100, 100),
            cy: makeRandomNumber(-100, 100),
          },
          before_t3
        );

        expect(after_t3).to.equal(before_t3);
        expect(after_t3).to.deep.equal(before_t3);
      });
    });
  }),
];
