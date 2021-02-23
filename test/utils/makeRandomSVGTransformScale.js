import { go, mapL, rangeL } from "fxjs/es";
import { $$createSVGTransformScale } from "../../src/createSVGTransformScale/createSVGTransformScale.index.js";
import { makeRandomNumber } from "./makeRandomNumber.js";

export const makeRandomSVGTransformScale = (
  random = () => makeRandomNumber(-100, 100)
) =>
  go(rangeL(2), mapL(random), ([sx, sy]) =>
    $$createSVGTransformScale({ sx, sy })()
  );
