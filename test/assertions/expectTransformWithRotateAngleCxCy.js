import { $$createSVGTransform } from "../../src/createSVGTransform/createSVGTransform.index.js";
import { expectSameValueSVGTransform } from "./expectSameValueSVGTransform.js";

export const expectTransformWithRotateAngleCxCy = ({
  transform: receive_transform,
  angle,
  cx,
  cy,
}) => {
  const expect_transform = $$createSVGTransform();
  expect_transform.setRotate(angle, cx, cy);
  expectSameValueSVGTransform(
    receive_transform,
    expect_transform,
    "expectTransformWithRotateAngleCxCy"
  );
};
