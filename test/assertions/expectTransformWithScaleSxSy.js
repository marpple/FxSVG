import { expect } from "chai";
import { go, tap } from "fxjs2";
import { $$createSVGTransform } from "../../src/createSVGTransform/createSVGTransform.index.js";
import { $$isScaleSVGTransform } from "../../src/isScaleSVGTransform/isScaleSVGTransform.index.js";

export const expectTransformWithScaleSxSy = ({ transform, sx, sy }) => {
  const matrix = go(
    $$createSVGTransform(),
    tap((transform) => transform.setScale(sx, sy)),
    ({ matrix }) => matrix
  );

  expect($$isScaleSVGTransform(transform)).to.be.true;
  expect(transform.matrix).to.deep.equal(matrix);
};
