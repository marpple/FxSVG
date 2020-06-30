import { each, go, mapL } from "fxjs2";
import { expectSameNumberEpsilon } from "./expectSameNumberEpsilon.js";

export const expectSameValueSVGMatrix = (receive_m, expect_m, message = "") =>
  go(
    ["a", "b", "c", "d", "e", "f"],
    mapL((k) => [
      receive_m[k],
      expect_m[k],
      `${message ? `${message}::` : ""}expectSameValueSVGMatrix::${k}`,
    ]),
    each(([receive_v, expect_v, m]) =>
      expectSameNumberEpsilon(receive_v, expect_v, 0.001, m)
    )
  );
