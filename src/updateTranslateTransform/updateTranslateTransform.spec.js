import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import { makeRandomInt, makeRandomSVGMatrix } from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateTranslateTransform } from "./updateTranslateTransform.index.js";

describe(`$$updateTranslateTransform`, function () {
  let t;

  beforeEach(function () {
    t = $$createSVGTransformTranslate()({
      tx: makeRandomInt(),
      ty: makeRandomInt(),
    });
  });

  it(`The SVGTransform's tx, ty values will be changed to input values.`, function () {
    const [tx, ty] = mapL(() => makeRandomInt(), rangeL(2));
    $$updateTranslateTransform(t, { tx, ty });

    expect(t.matrix.e).to.equal(tx);
    expect(t.matrix.f).to.equal(ty);
  });

  describe(`If there is an omitted input value, that value will be same with before.`, function () {
    it(`Omit tx.`, function () {
      const _tx = t.matrix.e;
      const ty = makeRandomInt();
      $$updateTranslateTransform(t, { ty });

      expect(t.matrix.e).to.equal(_tx);
      expect(t.matrix.f).to.equal(ty);
    });

    it(`Omit ty.`, function () {
      const _ty = t.matrix.f;
      const tx = makeRandomInt();
      $$updateTranslateTransform(t, { tx });

      expect(t.matrix.e).to.equal(tx);
      expect(t.matrix.f).to.equal(_ty);
    });

    it(`Omit tx, ty.`, function () {
      const { e: _tx, f: _ty } = t.matrix;
      $$updateTranslateTransform(t, {});

      expect(t.matrix.e).to.equal(_tx);
      expect(t.matrix.f).to.equal(_ty);
    });

    it(`Omit second argument.`, function () {
      const { e: _tx, f: _ty } = t.matrix;
      $$updateTranslateTransform(t);

      expect(t.matrix.e).to.equal(_tx);
      expect(t.matrix.f).to.equal(_ty);
    });
  });

  describe(`
  If the SVGTransform's type is not the SVGTransform.SVG_TRANSFORM_TRANSLATE,
  the function will do nothing but return SVGTransform.
  `, function () {
    it(`Use a matrix transform.`, function () {
      const matrix_t = $$createSVGTransformMatrix()({
        matrix: makeRandomSVGMatrix(),
      });
      const { matrix } = matrix_t;

      expect($$updateTranslateTransform(matrix_t, {})).to.equal(matrix_t);
      expect(matrix_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a rotate transform.`, function () {
      const rotate_t = $$createSVGTransformRotate()({
        angle: makeRandomInt(),
        cx: makeRandomInt(),
        cy: makeRandomInt(),
      });
      const { matrix } = rotate_t;

      expect($$updateTranslateTransform(rotate_t, {})).to.equal(rotate_t);
      expect(rotate_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a scale transform.`, function () {
      const scale_t = $$createSVGTransformScale()({
        sx: makeRandomInt(),
        sy: makeRandomInt(),
      });
      const { matrix } = scale_t;

      expect($$updateTranslateTransform(scale_t, {})).to.equal(scale_t);
      expect(scale_t.matrix).to.deep.equal(matrix);
    });
  });
});
