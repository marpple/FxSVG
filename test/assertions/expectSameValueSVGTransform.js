import { expect } from "chai";
import { expectSameValueSVGMatrix } from "./expectSameValueSVGMatrix.js";

export const expectSameValueSVGTransform = (
  receive_transform,
  expect_transform,
  message = ""
) => {
  message = `${message ? `${message}::` : ""}expectSameValueSVGTransform`;

  expect(receive_transform.type, message).equal(expect_transform.type);
  expectSameValueSVGMatrix(
    receive_transform.matrix,
    expect_transform.matrix,
    message
  );
};
