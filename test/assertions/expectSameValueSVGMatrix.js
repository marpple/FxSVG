import { expect } from "chai";
import { each, go, mapL } from "fxjs2";

export const expectSameValueSVGMatrix = (receive_m, expect_m, message = "") =>
  go(
    ["a", "b", "c", "d", "e", "f"],
    mapL((k) => [
      receive_m[k],
      expect_m[k],
      `${message ? `${message}::` : ""}expectSameValueSVGMatrix::${k}`,
    ]),
    each(([receive_v, expect_v, m]) => expect(receive_v, m).to.equal(expect_v))
  );
