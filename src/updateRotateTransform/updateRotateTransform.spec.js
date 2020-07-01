import { expect } from "chai";
import { each, go, go1, mapL, rangeL, takeL } from "fxjs2";
import {
  expectSameValueSVGTransform,
  expectTransformWithRotateAngleCxCy,
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
      const [
        { transform: transform1 },
        { transform: transform2 },
        { transform: transform3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [
        { angle: angle1, cx: cx1, cy: cy1 },
        { angle: angle2, cx: cx2, cy: cy2 },
        { angle: angle3, cx: cx3, cy: cy3 },
      ] = mapL(setupMockInputValues, rangeL(3));

      $$updateRotateTransform(transform1, { angle: angle1, cx: cx1, cy: cy1 });
      $$updateRotateTransform2({ angle: angle2, cx: cx2, cy: cy2 })(transform2);
      $$updateRotateTransform3({ angle: angle3, cx: cx3, cy: cy3 }, transform3);
      // $$updateRotateTransform3({ angle: angle3, cx: cx3, cy: cy3 })(transform3);

      each(
        ([transform, angle, cx, cy]) =>
          expectTransformWithRotateAngleCxCy({ transform, angle, cx, cy }),
        [
          [transform1, angle1, cx1, cy1],
          [transform2, angle2, cx2, cy2],
          [transform3, angle3, cx3, cy3],
        ]
      );
    });

    it(`The angle of the transform is same with before when there is no input angle.`, function () {
      const [
        { transform: transform1, angle: angle1 },
        { transform: transform2, angle: angle2 },
        { transform: transform3, angle: angle3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [
        { cx: cx1, cy: cy1 },
        { cx: cx2, cy: cy2 },
        { cx: cx3, cy: cy3 },
      ] = mapL(setupMockInputValues, rangeL(3));

      $$updateRotateTransform(transform1, { cx: cx1, cy: cy1 });
      $$updateRotateTransform2({ cx: cx2, cy: cy2 })(transform2);
      $$updateRotateTransform3({ cx: cx3, cy: cy3 }, transform3);
      // $$updateRotateTransform3({ cx: cx3, cy: cy3 })(transform3);

      each(
        ([transform, angle, cx, cy]) =>
          expectTransformWithRotateAngleCxCy({ transform, angle, cx, cy }),
        [
          [transform1, angle1, cx1, cy1],
          [transform2, angle2, cx2, cy2],
          [transform3, angle3, cx3, cy3],
        ]
      );
    });

    it(`The cx, cy of the transform is 0 when there is no input cx, cy.`, function () {
      const [
        { transform: transform1 },
        { transform: transform2 },
        { transform: transform3 },
      ] = mapL(setupMockTransform, rangeL(3));
      const [{ angle: angle1 }, { angle: angle2 }, { angle: angle3 }] = mapL(
        setupMockInputValues,
        rangeL(3)
      );

      $$updateRotateTransform(transform1, { angle: angle1 });
      $$updateRotateTransform2({ angle: angle2 })(transform2);
      $$updateRotateTransform3({ angle: angle3 }, transform3);
      // $$updateRotateTransform3({ angle: angle3 })(transform3);

      each(
        ([transform, angle]) =>
          expectTransformWithRotateAngleCxCy({
            transform,
            angle,
            cx: 0,
            cy: 0,
          }),
        [
          [transform1, angle1],
          [transform2, angle2],
          [transform3, angle3],
        ]
      );
    });

    it(`The angle of the transform is same with before and the cx, cy of the transform is 0
        when there is no input object.`, function () {
      const [
        { transform: transform1, angle: angle1 },
        { transform: transform2, angle: angle2 },
        { transform: transform3, angle: angle3 },
      ] = mapL(setupMockTransform, rangeL(3));

      $$updateRotateTransform(transform1);
      $$updateRotateTransform2()(transform2);
      $$updateRotateTransform3(undefined, transform3);
      // $$updateRotateTransform3()(transform3);

      each(
        ([transform, angle]) =>
          expectTransformWithRotateAngleCxCy({
            transform,
            angle,
            cx: 0,
            cy: 0,
          }),
        [
          [transform1, angle1],
          [transform2, angle2],
          [transform3, angle3],
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

        const [
          [angle1, cx1, cy1],
          [angle2, cx2, cy2],
          [angle3, cx3, cy3],
        ] = go1(
          rangeL(3),
          mapL(() => [
            makeRandomNumber(-700, 700),
            makeRandomNumber(-100, 100),
            makeRandomNumber(-100, 100),
          ])
        );

        const after_t1 = $$updateRotateTransform(before_t1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
        });
        const after_t2 = $$updateRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
        })(before_t2);
        const after_t3 = $$updateRotateTransform3(
          { angle: angle3, cx: cx3, cy: cy3 },
          before_t3
        );
        // const after_t3 = $$updateRotateTransform3({
        //   angle: angle3,
        //   cx: cx3,
        //   cy: cy3,
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

      it(`When the transform in a scale transform...`, function () {
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

        const [
          [angle1, cx1, cy1],
          [angle2, cx2, cy2],
          [angle3, cx3, cy3],
        ] = go1(
          rangeL(3),
          mapL(() => [
            makeRandomNumber(-700, 700),
            makeRandomNumber(-100, 100),
            makeRandomNumber(-100, 100),
          ])
        );

        const after_t1 = $$updateRotateTransform(before_t1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
        });
        const after_t2 = $$updateRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
        })(before_t2);
        const after_t3 = $$updateRotateTransform3(
          { angle: angle3, cx: cx3, cy: cy3 },
          before_t3
        );
        // const after_t3 = $$updateRotateTransform3({
        //   angle: angle3,
        //   cx: cx3,
        //   cy: cy3,
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

        const [
          [angle1, cx1, cy1],
          [angle2, cx2, cy2],
          [angle3, cx3, cy3],
        ] = go1(
          rangeL(3),
          mapL(() => [
            makeRandomNumber(-700, 700),
            makeRandomNumber(-100, 100),
            makeRandomNumber(-100, 100),
          ])
        );

        const after_t1 = $$updateRotateTransform(before_t1, {
          angle: angle1,
          cx: cx1,
          cy: cy1,
        });
        const after_t2 = $$updateRotateTransform2({
          angle: angle2,
          cx: cx2,
          cy: cy2,
        })(before_t2);
        const after_t3 = $$updateRotateTransform3(
          { angle: angle3, cx: cx3, cy: cy3 },
          before_t3
        );
        // const after_t3 = $$updateRotateTransform3({
        //   angle: angle3,
        //   cx: cx3,
        //   cy: cy3,
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
