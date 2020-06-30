import { $$createSVGTransform } from "../../src/createSVGTransform/createSVGTransform.index.js";
import { expectSameValueSVGTransform } from "./expectSameValueSVGTransform.js";

export const expectTransformWithTranslateTxTy = ({
  transform: receive_transform,
  tx,
  ty,
}) => {
  const expect_transform = $$createSVGTransform();
  expect_transform.setTranslate(tx, ty);
  expectSameValueSVGTransform(
    receive_transform,
    expect_transform,
    "expectTransformWithTranslateTxTy"
  );
};
