import { expect } from "chai";
import { go, tap } from "fxjs2";
import { $$createSVGTransform } from "../../src/createSVGTransform/createSVGTransform.index.js";
import { $$isRotateSVGTransform } from "../../src/isRotateSVGTransform/isRotateSVGTransform.index.js";

export const expectTransformWithRotateAngleCxCy = ({
  transform,
  angle,
  cx,
  cy,
}) => {
  const matrix = go(
    $$createSVGTransform(),
    tap((transform) => transform.setRotate(angle, cx, cy)),
    ({ matrix }) => matrix
  );

  expect($$isRotateSVGTransform(transform)).to.be.true;
  expect(transform.matrix).to.deep.equal(matrix);
};
