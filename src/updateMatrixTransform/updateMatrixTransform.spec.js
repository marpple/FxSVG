import { expect } from "chai";
import { pick } from "fxjs2";
import {
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateMatrixTransform } from "./updateMatrixTransform.index.js";

describe(`$$updateMatrixTransform`, function () {
  let t;

  beforeEach(function () {
    t = $$createSVGTransformMatrix()({ matrix: makeRandomSVGMatrix() });
  });

  it(`The SVGTransform's matrix is changed to input matrix.`, function () {
    const m = makeRandomSVGMatrix();
    $$updateMatrixTransform(t, { matrix: m });

    expect(t.matrix).to.deep.equal(m);
  });

  it(`If there is no second argument, the transform's matrix will be same with before.`, function () {
    const before_m = pick(["a", "b", "c", "d", "e", "f"], t.matrix);

    $$updateMatrixTransform(t);

    const after_m = pick(["a", "b", "c", "d", "e", "f"], t.matrix);

    expect(after_m).to.deep.equal(before_m);
  });

  it(`If there is no input matrix, the transform's matrix will be same with before.`, function () {
    const before_m = pick(["a", "b", "c", "d", "e", "f"], t.matrix);

    $$updateMatrixTransform(t, {});

    const after_m = pick(["a", "b", "c", "d", "e", "f"], t.matrix);

    expect(after_m).to.deep.equal(before_m);
  });

  describe(`
  If the SVGTransform's type is not the SVGTransform.SVG_TRANSFORM_MATRIX,
  the function will do nothing but return SVGTransform.
  `, function () {
    it(`Use a translate transform.`, function () {
      const translate_t = $$createSVGTransformTranslate()({
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });
      const { matrix } = translate_t;

      expect(
        $$updateMatrixTransform(translate_t, { matrix: makeRandomSVGMatrix() })
      ).to.equal(translate_t);
      expect(translate_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a rotate transform.`, function () {
      const rotate_t = $$createSVGTransformRotate()({
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      const { matrix } = rotate_t;

      expect(
        $$updateMatrixTransform(rotate_t, { matrix: makeRandomSVGMatrix() })
      ).to.equal(rotate_t);
      expect(rotate_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a scale transform.`, function () {
      const scale_t = $$createSVGTransformScale()({
        sx: makeRandomNumber(),
        sy: makeRandomNumber(),
      });
      const { matrix } = scale_t;

      expect(
        $$updateMatrixTransform(scale_t, { matrix: makeRandomSVGMatrix() })
      ).to.equal(scale_t);
      expect(scale_t.matrix).to.deep.equal(matrix);
    });
  });
});
