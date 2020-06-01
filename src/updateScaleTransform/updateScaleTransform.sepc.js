import { expect } from "chai";
import { mapL, rangeL } from "fxjs2";
import {
  makeRandomInt,
  makeRandomNumber,
  makeRandomSVGMatrix,
} from "../../test/utils/index.js";
import { $$createSVGTransformMatrix } from "../createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { $$createSVGTransformRotate } from "../createSVGTransformRotate/createSVGTransformRotate.index.js";
import { $$createSVGTransformScale } from "../createSVGTransformScale/createSVGTransformScale.index.js";
import { $$createSVGTransformTranslate } from "../createSVGTransformTranslate/createSVGTransformTranslate.index.js";
import { $$updateScaleTransform } from "./updateScaleTransform.index.js";

describe(`$$updateScaleTransform`, function () {
  let t;

  beforeEach(function () {
    t = $$createSVGTransformScale()({
      sx: makeRandomInt(),
      sy: makeRandomInt(),
    });
  });

  it(`The SVGTransform's sx, sy values will be changed to input values.`, function () {
    const [sx, sy] = mapL(() => makeRandomInt(), rangeL(2));
    $$updateScaleTransform(t, { sx, sy });

    expect(t.matrix.a).to.equal(sx);
    expect(t.matrix.d).to.equal(sy);
  });

  describe(`If there is an omitted input value, that value will be same with before.`, function () {
    it(`Omit sx.`, function () {
      const _sx = t.matrix.a;
      const sy = makeRandomInt();
      $$updateScaleTransform(t, { sy });

      expect(t.matrix.a).to.equal(_sx);
      expect(t.matrix.d).to.equal(sy);
    });

    it(`Omit sy.`, function () {
      const _sy = t.matrix.d;
      const sx = makeRandomInt();
      $$updateScaleTransform(t, { sx });

      expect(t.matrix.a).to.equal(sx);
      expect(t.matrix.d).to.equal(_sy);
    });

    it(`Omit sx, sy.`, function () {
      const { a: _sx, d: _sy } = t.matrix;
      $$updateScaleTransform(t, {});

      expect(t.matrix.a).to.equal(_sx);
      expect(t.matrix.d).to.equal(_sy);
    });

    it(`Omit second argument.`, function () {
      const { a: _sx, d: _sy } = t.matrix;
      $$updateScaleTransform(t);

      expect(t.matrix.a).to.equal(_sx);
      expect(t.matrix.d).to.equal(_sy);
    });
  });

  describe(`
  If the SVGTransform's type is not the SVGTransform.SVG_TRANSFORM_SCALE,
  the function will do nothing but return SVGTransform.
  `, function () {
    it(`Use a matrix transform.`, function () {
      const matrix = makeRandomSVGMatrix();
      const matrix_t = $$createSVGTransformMatrix()(matrix);

      expect(
        $$updateScaleTransform(matrix_t, {
          sx: makeRandomNumber(),
          sy: makeRandomNumber(),
        })
      ).to.equal(matrix_t);
      expect(matrix_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a rotate transform.`, function () {
      const rotate_t = $$createSVGTransformRotate()({
        angle: makeRandomNumber(),
        cx: makeRandomNumber(),
        cy: makeRandomNumber(),
      });
      const { matrix } = rotate_t;

      expect(
        $$updateScaleTransform(rotate_t, {
          sx: makeRandomNumber(),
          sy: makeRandomNumber(),
        })
      ).to.equal(rotate_t);
      expect(rotate_t.matrix).to.deep.equal(matrix);
    });

    it(`Use a translate transform.`, function () {
      const translate_t = $$createSVGTransformTranslate()({
        tx: makeRandomNumber(),
        ty: makeRandomNumber(),
      });
      const { matrix } = translate_t;

      expect(
        $$updateScaleTransform(translate_t, {
          sx: makeRandomNumber(),
          sy: makeRandomNumber(),
        })
      ).to.equal(translate_t);
      expect(translate_t.matrix).to.deep.equal(matrix);
    });
  });
});
