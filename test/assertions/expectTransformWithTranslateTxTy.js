import { expect } from "chai";
import { go, tap } from "fxjs2";
import { $$createSVGTransform } from "../../src/createSVGTransform/createSVGTransform.index.js";
import { $$isTranslateSVGTransform } from "../../src/isTranslateSVGTransform/isTranslateSVGTransform.index.js";
import { expectSameValueSVGMatrix } from "./expectSameValueSVGMatrix.js";

export const expectTransformWithTranslateTxTy = ({ transform, tx, ty }) => {
  const matrix = go(
    $$createSVGTransform(),
    tap((transform) => transform.setTranslate(tx, ty)),
    ({ matrix }) => matrix
  );

  expect($$isTranslateSVGTransform(transform)).true;
  expectSameValueSVGMatrix(
    transform.matrix,
    matrix,
    "expectTransformWithTranslateTxTy"
  );
};
