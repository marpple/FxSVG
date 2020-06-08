import { go1 } from "fxjs2";
import { $$createSVGTransformMatrix } from "../../src/createSVGTransformMatrix/createSVGTransformMatrix.index.js";
import { makeRandomNumber } from "./makeRandomNumber.js";
import { makeRandomSVGMatrix } from "./makeRandomSVGMatrix.js";

export const makeRandomSVGTransformMatrix = (
  random = () => makeRandomNumber(-100, 100)
) =>
  go1(makeRandomSVGMatrix(random), (matrix) =>
    $$createSVGTransformMatrix()({ matrix })
  );
