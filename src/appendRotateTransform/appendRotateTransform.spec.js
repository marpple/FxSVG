import { expect } from "chai";
import { each, equals2, go, mapL, rangeL, rejectL, takeL, zipL } from "fxjs2";
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
import {
  $$appendRotateTransform,
  $$appendRotateTransform2,
  $$appendRotateTransform3,
} from "./appendRotateTransform.index.js";

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
      const [
        { transform: input1 },
        { transform: input2 },
        { transform: input3 },
      ] = mapL(() => setupMock(), rangeL(3));
      const [angle1, angle2, angle3] = mapL(
        () => makeRandomNumber(-700, 700),
        rangeL(3)
      );

      const output1 = $$appendRotateTransform(input1, { angle: angle1 });
      const output2 = $$appendRotateTransform2({ angle: angle2 })(input2);
      const output3 = $$appendRotateTransform3({ angle: angle3 }, input3);
      // const output3 = $$appendRotateTransform3({ angle: angle3 })(input3);

      each(([input, output]) => expect(output).equal(input), [
        [input1, output1],
        [input2, output2],
        [input3, output3],
      ]);
    });

    it(`The transform's angle is added with the input angle.`, function () {
      const [
        { transform: transform1, angle: prev_angle1 },
        { transform: transform2, angle: prev_angle2 },
        { transform: transform3, angle: prev_angle3 },
      ] = mapL(() => setupMock(), rangeL(3));
      const [angle1, angle2, angle3] = mapL(
        () => makeRandomInt(-700, 700),
        rangeL(3)
      );

      $$appendRotateTransform(transform1, { angle: angle1 });
      $$appendRotateTransform2({ angle: angle2 })(transform2);
      $$appendRotateTransform3({ angle: angle3 }, transform3);
      // $$appendRotateTransform3({ angle: angle3 })(transform3);

      each(
        ([transform, prev_angle, angle]) =>
          expect(transform.angle).equal(prev_angle + angle),
        [
          [transform1, prev_angle1, angle1],
          [transform2, prev_angle2, angle2],
          [transform3, prev_angle3, angle3],
        ]
      );
    });

    it(`The transform's angle will not change if no input angle.`, function () {
      const cases = go(
        rangeL(3),
        mapL(() => [undefined, {}]),
        (iterables) => zipL(...iterables)
      );

      for (const [option1, option2, option3] of cases) {
        const [
          { transform: transform1, angle: angle1 },
          { transform: transform2, angle: angle2 },
          { transform: transform3, angle: angle3 },
        ] = mapL(() => setupMock(), rangeL(3));

        $$appendRotateTransform(transform1, option1);
        $$appendRotateTransform2(option2)(transform2);
        $$appendRotateTransform3(option3, transform3);
        // $$appendRotateTransform3(option3)(transform3);

        each(([transform, angle]) => expect(transform.angle).to.equal(angle), [
          [transform1, angle1],
          [transform2, angle2],
          [transform3, angle3],
        ]);
      }
    });

    it(`The transform's cx, cy will be 0.`, function () {
      const [
        { transform: transform1 },
        { transform: transform2 },
        { transform: transform3 },
      ] = go(
        rangeL(Infinity),
        mapL(() => makeRandomNumber(-100, 100)),
        rejectL(equals2(0)),
        (iter) =>
          mapL(() => [iter.next().value, iter.next().value], rangeL(Infinity)),
        mapL(([cx, cy]) => setupMock({ cx, cy })),
        takeL(3)
      );
      const [angle1, angle2, angle3] = mapL(
        () => makeRandomInt(-700, 700),
        rangeL(3)
      );

      $$appendRotateTransform(transform1, { angle: angle1 });
      $$appendRotateTransform2({ angle: angle2 })(transform2);
      $$appendRotateTransform3({ angle: angle3 }, transform3);
      // $$appendRotateTransform3({ angle: angle3 })(transform3);

      each(
        (transform) => {
          expect(transform.matrix.e).to.equal(0);
          expect(transform.matrix.f).to.equal(0);
        },
        [transform1, transform2, transform3]
      );
    });

    describe(`If the transform is another type transform, the function will do nothing but return the input.`, function () {
      it(`When the transform is a matrix transform...`, function () {
        const [before_t1, before_t2, before_t3] = go(
          rangeL(3),
          mapL(() => makeRandomSVGMatrix(() => makeRandomNumber(-100, 100))),
          mapL((matrix) => $$createSVGTransformMatrix({ matrix })())
        );
        const [angle1, angle2, angle3] = mapL(
          () => makeRandomNumber(-700, 700),
          rangeL(3)
        );

        const after_t1 = $$appendRotateTransform(before_t1, { angle: angle1 });
        const after_t2 = $$appendRotateTransform2({ angle: angle2 })(before_t2);
        const after_t3 = $$appendRotateTransform3({ angle: angle3 }, before_t3);
        // const after_t3 = $$appendRotateTransform3({ angle: angle3 })(before_t3);

        go(
          [after_t1, after_t2, after_t3],
          zipL([before_t1, before_t2, before_t3]),
          each(([before_t, after_t]) => {
            expect(after_t).to.equal(before_t);
            expectSameValueSVGTransform(after_t, before_t);
          })
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
        const [angle1, angle2, angle3] = mapL(
          () => makeRandomNumber(-700, 700),
          rangeL(3)
        );

        const after_t1 = $$appendRotateTransform(before_t1, { angle: angle1 });
        const after_t2 = $$appendRotateTransform2({ angle: angle2 })(before_t2);
        const after_t3 = $$appendRotateTransform3({ angle: angle3 }, before_t3);
        // const after_t3 = $$appendRotateTransform3({ angle: angle3 })(before_t3);

        go(
          [after_t1, after_t2, after_t3],
          zipL([before_t1, before_t2, before_t3]),
          each(([before_t, after_t]) => {
            expect(after_t).to.equal(before_t);
            expectSameValueSVGTransform(after_t, before_t);
          })
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
        const [angle1, angle2, angle3] = mapL(
          () => makeRandomNumber(-700, 700),
          rangeL(3)
        );

        const after_t1 = $$appendRotateTransform(before_t1, { angle: angle1 });
        const after_t2 = $$appendRotateTransform2({ angle: angle2 })(before_t2);
        const after_t3 = $$appendRotateTransform3({ angle: angle3 }, before_t3);
        // const after_t3 = $$appendRotateTransform3({ angle: angle3 })(before_t3);

        go(
          [after_t1, after_t2, after_t3],
          zipL([before_t1, before_t2, before_t3]),
          each(([before_t, after_t]) => {
            expect(after_t).to.equal(before_t);
            expectSameValueSVGTransform(after_t, before_t);
          })
        );
      });
    });
  }),
];
