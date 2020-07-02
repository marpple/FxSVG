import { $$createSVGTransform } from "../../src/createSVGTransform/createSVGTransform.index.js";
import { expectSameValueSVGTransform } from "./expectSameValueSVGTransform.js";

export const expectTransformWithScaleSxSy = ({
  transform: receive_transform,
  sx,
  sy,
}) => {
  const expect_transform = $$createSVGTransform();
  expect_transform.setScale(sx, sy);
  expectSameValueSVGTransform(
    receive_transform,
    expect_transform,
    "expectTransformWithScaleSxSy"
  );
};
