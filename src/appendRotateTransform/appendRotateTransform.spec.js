import { expect } from "chai";
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

describe(`$$appendRotateTransform`, function () {
  let t;

  beforeEach(function () {
    t = $$createSVGTransformRotate()({ angle: makeRandomInt(), cx: 0, cy: 0 });
  });

  it(`The SVGTransform's angle value will be added with input angle value.`, function () {
    const { angle: prev_angle } = t;
    const angle = makeRandomInt();
    $$appendRotateTransform(t, { angle });

    expect(t.angle).to.equal(prev_angle + angle);
  });

  it(`The SVGTransform's cx, cy will be 0.`, function () {
    const angle1 = makeRandomInt();
    const angle2 = makeRandomInt();
    t = $$createSVGTransformRotate()({
      angle: angle1,
      cx: 10,
      cy: 10,
    });
    $$appendRotateTransform(t, { angle: angle2 });

    expect(t.angle).to.equal(angle1 + angle2);
    expect(t.matrix.e).to.equal(0);
    expect(t.matrix.f).to.equal(0);
  });

  it(`If no second argument, the function will throw an error.`, function () {
    expect(() => $$appendRotateTransform(t)).to.throw();
  });

  it(`If no input angle value, SVGTransform keep original angle value.`, function () {
    const { angle: before_angle } = t;

    $$appendRotateTransform(t, {});

    const { angle: after_angle } = t;

    expect(after_angle).to.equal(before_angle);
  });

  describe(`If the SVGTransform is not a rotate transform, the function will do nothing but return the transform.`, function () {
    it(`Use a matrix transform.`, function () {
      const before_t = $$createSVGTransformMatrix()({
        matrix: makeRandomSVGMatrix(),
      });
      const { matrix } = before_t;

      const after_t = $$appendRotateTransform(before_t, {
        angle: makeRandomNumber(),
      });

      expect(after_t).to.equal(before_t);
      expect(before_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a translate transform.`, function () {
      const before_t = $$createSVGTransformTranslate()({
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });
      const { matrix } = before_t;

      const after_t = $$appendRotateTransform(before_t, {
        angle: makeRandomNumber(),
      });

      expect(after_t).to.equal(before_t);
      expect(before_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a scale transform.`, function () {
      const before_t = $$createSVGTransformScale()({
        sx: makeRandomNumber(),
        sy: makeRandomNumber(),
      });
      const { matrix } = before_t;

      const after_t = $$appendRotateTransform(before_t, {
        angle: makeRandomNumber(),
      });

      expect(after_t).to.equal(before_t);
      expect(before_t.matrix).to.deep.equal(matrix);
    });
  });
});
