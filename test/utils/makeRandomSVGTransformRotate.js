import { go, mapL, rangeL } from "fxjs";
import { $$createSVGTransformRotate } from "../../src/createSVGTransformRotate/createSVGTransformRotate.index.js";
import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomSVGTransformRotate = (
  random = () => makeRandomNumber(-700, 700)
) =>
  go(rangeL(3), mapL(random), ([angle, cx, cy]) =>
    $$createSVGTransformRotate({ angle, cx, cy })()
  );
