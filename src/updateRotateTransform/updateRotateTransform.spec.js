import { expect } from "chai";
import { makeRandomInt, makeRandomNumber } from "../../test/utils/index.js";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateRotateTransform } from "./updateRotateTransform.index.js";

describe(`$$updateRotateTransform`, function () {
  let t;

  beforeEach(function () {
    t = $$createSVGTransformRotate()({
      angle: makeRandomInt(),
      cx: makeRandomNumber(),
      cy: makeRandomNumber(),
    });
  });

  it(`The SVGTransform's angle value will be updated to the input value.`, function () {
    const angle = makeRandomInt();
    $$updateRotateTransform(t, { angle });

    expect(t.angle).to.equal(angle);
  });

  it(`If no second argument, the angle will be same but cx, cy will be 0.`, function () {
    const { angle: before_angle } = t;

    $$updateRotateTransform(t);

    const { angle: after_angle } = t;

    expect(after_angle).to.equal(before_angle);
  });

  it(`If no cx, cy values, The cx, cy values will be reset to 0.`, function () {
    $$updateRotateTransform(t, { angle: makeRandomInt() });

    expect(t.matrix.e).to.equal(0);
    expect(t.matrix.f).to.equal(0);
  });

  it(`If no angle value, the angle will be same.`, function () {
    const { angle: before_angle } = t;

    $$updateRotateTransform(t, {
      cx: makeRandomNumber(),
      cy: makeRandomNumber(),
    });

    const { angle: after_angle } = t;

    expect(after_angle).to.equal(before_angle);
  });

  describe(`
  If the SVGTransform's type is not a SVGTransform.SVG_TRANSFORM_ROTATE,
  the function will do nothing but return SVGTransform. 
  `, function () {
    it(`Use a matrix transform.`, function () {
      const matrix = $$createSVGMatrix()({
        a: makeRandomNumber(),
        b: makeRandomNumber(),
        c: makeRandomNumber(),
        d: makeRandomNumber(),
        e: makeRandomNumber(),
        f: makeRandomNumber(),
      });
      const matrix_t = $$createSVGTransformMatrix()(matrix);

      expect(
        $$updateRotateTransform(matrix_t, { angle: makeRandomNumber() })
      ).to.equal(matrix_t);
      expect(matrix_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a translate transform.`, function () {
      const translate_t = $$createSVGTransformTranslate()({
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });
      const { matrix } = translate_t;

      expect(
        $$updateRotateTransform(translate_t, { angle: makeRandomNumber() })
      );
      expect(translate_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a scale transform.`, function () {
      const scale_t = $$createSVGTransformScale()({
        sx: makeRandomNumber(),
        sy: makeRandomNumber(),
      });
      const { matrix } = scale_t;

      expect(
        $$updateRotateTransform(scale_t, { angle: makeRandomNumber() })
      ).to.equal(scale_t);
      expect(scale_t.matrix).to.deep.equal(matrix);
    });
  });
});
