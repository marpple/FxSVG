import { expect } from "chai";
import { $$createSVGMatrix } from "../createSVGMatrix/createSVGMatrix.index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateTranslateTransform } from "./updateTranslateTransform.index.js";

const makeRandomNumber = () => {
  const n = Math.round(Math.random() * 1000);
  return Math.round(Math.random()) ? n : -n;
};

describe(`$$updateTranslateTransform`, function () {
  let t;

  beforeEach(function () {
    t = $$createSVGTransformTranslate()({
      tx: makeRandomNumber(),
      ty: makeRandomNumber(),
    });
  });

  it(`The SVGTransform's tx, ty values will be changed to input values.`, function () {
    const tx = makeRandomNumber();
    const ty = makeRandomNumber();
    $$updateTranslateTransform(t, { tx, ty });

    expect(t.matrix.e).to.equal(tx);
    expect(t.matrix.f).to.equal(ty);
  });

  describe(`If there is an omitted input value, that value will be same with before.`, function () {
    it(`Omit tx.`, function () {
      const _tx = t.matrix.e;
      const ty = makeRandomNumber();
      $$updateTranslateTransform(t, { ty });

      expect(t.matrix.e).to.equal(_tx);
      expect(t.matrix.f).to.equal(ty);
    });

    it(`Omit ty.`, function () {
      const _ty = t.matrix.f;
      const tx = makeRandomNumber();
      $$updateTranslateTransform(t, { tx });

      expect(t.matrix.e).to.equal(tx);
      expect(t.matrix.f).to.equal(_ty);
    });

    it(`Omit tx, ty.`, function () {
      const _tx = t.matrix.e;
      const _ty = t.matrix.f;
      $$updateTranslateTransform(t, {});

      expect(t.matrix.e).to.equal(_tx);
      expect(t.matrix.f).to.equal(_ty);
    });
  });

  describe(`
  If the SVGTransform's type is not the SVGTransform.SVG_TRANSFORM_TRANSLATE,
  the function will do nothing but return SVGTransform.
  `, function () {
    it(`Matrix Transform`, function () {
      const matrix = $$createSVGMatrix()({
        a: makeRandomNumber(),
        b: makeRandomNumber(),
        c: makeRandomNumber(),
        d: makeRandomNumber(),
        e: makeRandomNumber(),
        f: makeRandomNumber(),
      });
      const matrix_t = $$createSVGTransformMatrix()(matrix);

      expect($$updateTranslateTransform(matrix_t, {})).to.equal(matrix_t);
      expect(matrix_t.matrix).to.deep.equal(matrix);
    });

    it(`Rotate Transform`, function () {
      const rotate_t = $$createSVGTransformRotate()({
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      const { matrix } = rotate_t;

      expect($$updateTranslateTransform(rotate_t, {})).to.equal(rotate_t);
      expect(rotate_t.matrix).to.deep.equal(matrix);
    });

    it(`Scale Transform`, function () {
      const scale_t = $$createSVGTransformScale()({
        sx: makeRandomNumber(),
        sy: makeRandomNumber(),
      });
      const { matrix } = scale_t;

      expect($$updateTranslateTransform(scale_t, {})).to.equal(scale_t);
      expect(scale_t.matrix).to.deep.equal(matrix);
    });
  });
});
