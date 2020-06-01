import { expect } from "chai";
import { makeRandomInt } from "../../test/utils/makeRandomInt.js";
import { makeRandomNumber } from "../../test/utils/makeRandomNumber.js";
import { makeRandomSVGMatrix } from "../../test/utils/makeRandomSVGMatrix.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$appendTranslateTransform } from "./appendTranslateTransform.index.js";

describe(`$$appendTranslateTransform`, function () {
  let t;

  beforeEach(function () {
    t = $$createSVGTransformTranslate()({
      tx: makeRandomInt(),
      ty: makeRandomInt(),
    });
  });

  it(`The return value is the same reference of input SVGTransform.`, function () {
    const return_t = $$appendTranslateTransform(t, {
      tx: makeRandomNumber(),
      ty: makeRandomNumber(),
    });

    expect(return_t).to.equal(t);
  });

  it(`The SVGTransform's tx, ty values will be added with input tx, ty values.`, function () {
    const { e: prev_tx, f: prev_ty } = t.matrix;
    const added_tx = makeRandomInt();
    const added_ty = makeRandomInt();

    $$appendTranslateTransform(t, { tx: added_tx, ty: added_ty });

    expect(t.matrix.e).to.equal(prev_tx + added_tx);
    expect(t.matrix.f).to.equal(prev_ty + added_ty);
  });

  it(`If no second argument, the function will throw an error.`, function () {
    expect(() => $$appendTranslateTransform(t)).to.throw();
  });

  it(`If no input tx, ty values, SVGTransform keep original tx, ty values.`, function () {
    const { e: original_tx, f: original_ty } = t.matrix;

    $$appendTranslateTransform(t, {});

    expect(t.matrix.e).to.equal(original_tx);
    expect(t.matrix.f).to.equal(original_ty);
  });

  describe(`
  If the SVGTransform's type is not a SVGTransform.SVG_TRANSFORM_TRANSLATE,
  the function will do nothing but return the SVGTransform.
  `, function () {
    it(`Use a matrix transform.`, function () {
      const matrix_t = $$createSVGTransformMatrix()(makeRandomSVGMatrix());
      const { matrix } = matrix_t;

      const return_t = $$appendTranslateTransform(matrix_t, {
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });

      expect(return_t).to.equal(matrix_t);
      expect(matrix_t.matrix).to.equal(matrix);
    });

    it(`Use a rotate transform.`, function () {
      const rotate_t = $$createSVGTransformRotate()({
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      const { matrix } = rotate_t;

      const return_t = $$appendTranslateTransform(rotate_t, {
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });

      expect(return_t).to.equal(rotate_t);
      expect(rotate_t.matrix).to.equal(matrix);
    });

    it(`Use a scale transform.`, function () {
      const scale_t = $$createSVGTransformScale()({
        sx: makeRandomNumber(),
        sy: makeRandomNumber(),
      });
      const { matrix } = scale_t;

      const return_t = $$appendTranslateTransform(scale_t, {
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });

      expect(return_t).to.equal(scale_t);
      expect(scale_t.matrix).to.equal(matrix);
    });
  });
});
