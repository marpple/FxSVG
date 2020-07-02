import { expect } from "chai";

export const expectSameNumberEpsilon = (
  receive_number,
  expect_number,
  epsilon = Number.EPSILON,
  message = ""
) =>
  expect(
    Math.abs(receive_number - expect_number) < epsilon,
    `${
      message ? `${message}::` : ""
    }receive:${receive_number},expect:${expect_number}`
  ).true;
