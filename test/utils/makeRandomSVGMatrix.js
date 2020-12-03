import { go, mapL, object, split } from "fxjs/esm";
import { $$createSVGMatrix } from "../../src/createSVGMatrix/createSVGMatrix.index.js";
import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomSVGMatrix = (random = makeRandomNumber) =>
  go(
    "abcdef",
    split(""),
    mapL((k) => [k, random()]),
    object,
    (values) => $$createSVGMatrix(values)()
  );
